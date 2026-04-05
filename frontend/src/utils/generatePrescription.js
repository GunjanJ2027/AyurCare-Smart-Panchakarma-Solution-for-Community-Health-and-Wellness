// frontend/src/utils/generatePrescription.js
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; // <-- CHANGED: Explicitly importing autoTable

export const generatePrescription = (patientName, therapyName, doshaProfile, date) => {
  // 1. Create a new blank PDF (A4 size)
  const doc = new jsPDF();

  // 2. Add Header / Clinic Info
  doc.setFontSize(22);
  doc.setTextColor(16, 185, 129); // Tailwind Emerald-500
  doc.text('AyurCare Wellness Center', 105, 20, { align: 'center' });
  
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text('In association with The Earth Saviours Foundation', 105, 28, { align: 'center' });
  doc.text('Official Post-Therapy Prescription & Diet Plan', 105, 34, { align: 'center' });

  // Draw a dividing line
  doc.setLineWidth(0.5);
  doc.line(20, 40, 190, 40);

  // 3. Patient Details Section
  doc.setFontSize(12);
  doc.setTextColor(0);
  doc.text(`Patient Name: ${patientName}`, 20, 50);
  doc.text(`Date of Therapy: ${new Date(date).toLocaleDateString()}`, 130, 50);
  doc.text(`Therapy Administered: ${therapyName}`, 20, 60);
  doc.text(`Primary Dosha: ${doshaProfile || 'Tridoshic'}`, 130, 60);

  // 4. Ayurvedic Diet Recommendations Table
  // <-- CHANGED: Calling autoTable directly and passing the doc into it
  autoTable(doc, {
    startY: 75,
    headStyles: { fillColor: [16, 185, 129] },
    head: [['Category', 'Recommended', 'To Avoid']],
    body: [
      ['Grains', 'Aged Rice, Barley, Quinoa', 'Fresh wheat, heavy breads'],
      ['Vegetables', 'Cooked greens, Bottle gourd, Carrots', 'Raw salads, Cabbage, Potatoes'],
      ['Dairy', 'Warm milk with turmeric, Ghee', 'Cold yogurt, Ice cream'],
      ['Spices', 'Cumin, Coriander, Fennel, Ginger', 'Excessive chili, Raw garlic'],
      ['Lifestyle', 'Warm baths, Gentle walking, Early sleep', 'Daytime napping, Strenuous exercise']
    ],
  });

  // 5. Doctor's Notes / Footer
  const finalY = doc.lastAutoTable.finalY || 130;
  doc.setFontSize(11);
  doc.text('Practitioner Notes:', 20, finalY + 15);
  doc.setFontSize(10);
  doc.setTextColor(80);
  doc.text('Please follow this diet strictly for the next 7 days to maximize the benefits of your Panchakarma therapy.', 20, finalY + 25);
  doc.text('For any emergencies, please contact the clinic immediately.', 20, finalY + 32);

  doc.setFontSize(12);
  doc.setTextColor(0);
  doc.text('Authorized Signature: _________________', 120, finalY + 50);

  // 6. Save the file!
  doc.save(`AyurCare_Prescription_${patientName.replace(/\s+/g, '_')}.pdf`);
};