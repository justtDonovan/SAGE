const PDFDocument = require('pdfkit');
const GradeModel = require('../models/gradeModel');

const VALID_EVALUATIONS = ['Periodo 1', 'Periodo 2', 'Periodo 3'];

function getReportStats(rows) {
  const grades = rows.map((row) => Number(row.grade)).filter((grade) => !Number.isNaN(grade));
  const average = grades.length ? grades.reduce((sum, grade) => sum + grade, 0) / grades.length : null;
  const minimum = grades.length ? Math.min(...grades) : null;
  const maximum = grades.length ? Math.max(...grades) : null;
  const fails = grades.filter((grade) => grade === 0).length;

  return {
    average,
    minimum,
    maximum,
    fails,
  };
}

function drawReportTable(doc, rows) {
  const columns = [
    { label: 'Alumno', width: 250 },
    { label: 'Grupo', width: 120 },
    { label: 'Calificación', width: 90 },
  ];
  const startX = doc.page.margins.left;
  let currentY = doc.y;

  const drawHeader = () => {
    let x = startX;
    doc.font('Helvetica-Bold').fontSize(10);
    doc.fillColor('#ffffff');
    doc.rect(startX, currentY, columns.reduce((sum, column) => sum + column.width, 0), 22).fill('#1f4e79');
    doc.fillColor('#ffffff');
    columns.forEach((column) => {
      doc.text(column.label, x + 6, currentY + 6, { width: column.width - 12, align: 'left' });
      x += column.width;
    });
    currentY += 22;
    doc.fillColor('#000000');
    doc.font('Helvetica');
  };

  drawHeader();

  rows.forEach((row, index) => {
    const studentName = `${row.first_name || ''} ${row.last_name || ''}`.trim() || '-';
    const groupName = row.group_name || '-';
    const gradeValue = row.grade === null || row.grade === undefined ? '-' : Number(row.grade).toFixed(2);
    const rowHeight = Math.max(
      doc.heightOfString(studentName, { width: columns[0].width - 12 }),
      doc.heightOfString(groupName, { width: columns[1].width - 12 }),
      doc.heightOfString(gradeValue, { width: columns[2].width - 12 }),
      16
    ) + 10;

    if (currentY + rowHeight > doc.page.height - doc.page.margins.bottom) {
      doc.addPage();
      currentY = doc.page.margins.top;
      drawHeader();
    }

    const rowFill = index % 2 === 0 ? '#f5f7fb' : '#ffffff';
    doc.rect(startX, currentY, columns.reduce((sum, column) => sum + column.width, 0), rowHeight).fillAndStroke(rowFill, '#d0d7de');
    doc.fillColor('#000000');

    let x = startX;
    doc.text(studentName, x + 6, currentY + 6, { width: columns[0].width - 12, align: 'left' });
    x += columns[0].width;
    doc.text(groupName, x + 6, currentY + 6, { width: columns[1].width - 12, align: 'left' });
    x += columns[1].width;
    doc.text(gradeValue, x + 6, currentY + 6, { width: columns[2].width - 12, align: 'left' });

    currentY += rowHeight;
  });

  doc.y = currentY + 18;
}

const GradeController = {
  getStudentGrades: async (req, res) => {
    try {
      const { studentId } = req.params;
      const grades = await GradeModel.getGradesByStudent(studentId);
      res.json(grades);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  upsertGrades: async (req, res) => {
    try {
      const { class_id, evaluation, records, teacher_id } = req.body;
      if (!class_id || !evaluation || !records) {
        return res.status(400).json({ error: 'Datos incompletos' });
      }

      if (!VALID_EVALUATIONS.includes(evaluation)) {
        return res.status(400).json({ error: 'La evaluación debe ser: Periodo 1, Periodo 2 o Periodo 3' });
      }

      for (const record of records) {
        await GradeModel.upsert({
          class_id,
          student_id: record.student_id,
          evaluation,
          grade: record.grade,
          recorded_by_teacher_id: teacher_id
        });
      }

      res.json({ message: 'Calificaciones guardadas con éxito' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  listByClass: async (req, res) => {
    try {
      const { classId, evaluation } = req.params;
      if (!VALID_EVALUATIONS.includes(evaluation)) {
        return res.status(400).json({ error: 'Evaluación inválida' });
      }
      const grades = await GradeModel.getByClassAndEval(classId, evaluation);
      res.json(grades);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getGradeTable: async (req, res) => {
    try {
      const { classId, evaluation } = req.params;
      if (!VALID_EVALUATIONS.includes(evaluation)) {
        return res.status(400).json({ error: 'Evaluación inválida' });
      }
      const rows = await GradeModel.getGradeTableByClassAndEval(classId, evaluation);
      res.json(rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  downloadGradeReportPdf: async (req, res) => {
    try {
      const { classId, evaluation } = req.params;
      if (!VALID_EVALUATIONS.includes(evaluation)) {
        return res.status(400).json({ error: 'Evaluación inválida' });
      }

      const rows = await GradeModel.getGradeTableByClassAndEval(classId, evaluation);
      const stats = getReportStats(rows);
      const meta = rows[0] || {};
      const pdf = new PDFDocument({ size: 'A4', layout: 'landscape', margin: 36 });
      const fileName = `reporte_calificaciones_${(meta.class_name || 'clase').replace(/\s+/g, '_')}_${evaluation.replace(/\s+/g, '_')}.pdf`;

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

      pdf.pipe(res);
      pdf.font('Helvetica-Bold').fontSize(20).text('Reporte de Calificaciones', { align: 'center' });
      pdf.moveDown(0.5);
      pdf.font('Helvetica').fontSize(10).fillColor('#555555').text(`Generado el: ${new Date().toLocaleString('es-MX')}`, { align: 'center' });
      pdf.moveDown(1);

      pdf.fillColor('#000000').fontSize(12);
      pdf.text(`Clase: ${meta.class_name || '-'}`);
      pdf.text(`Grupo: ${meta.group_name || '-'}`);
      pdf.text(`Evaluación: ${evaluation}`);
      pdf.text(`Profesor: ${meta.teacher_name || '-'}`);
      pdf.moveDown(0.5);

      pdf.font('Helvetica-Bold').text('Resumen', { underline: true });
      pdf.font('Helvetica').text(`Promedio: ${stats.average === null ? '-' : stats.average.toFixed(2)}`);
      pdf.text(`Mínimo: ${stats.minimum === null ? '-' : stats.minimum.toFixed(2)}`);
      pdf.text(`Máximo: ${stats.maximum === null ? '-' : stats.maximum.toFixed(2)}`);
      pdf.text(`Reprobados (0): ${stats.fails}`);
      pdf.moveDown(0.5);

      pdf.font('Helvetica-Bold').text('Detalle', { underline: true });
      pdf.moveDown(0.4);
      if (rows.length) {
        drawReportTable(pdf, rows);
      } else {
        pdf.font('Helvetica').text('No hay calificaciones registradas para la clase y evaluación seleccionadas.');
      }

      pdf.end();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getFilters: async (req, res) => {
    try {
      const teacherId = req.query.teacher_id ? Number(req.query.teacher_id) : null;
      const data = await GradeModel.getGradeFilters(teacherId || null);
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = GradeController;
