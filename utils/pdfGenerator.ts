
import { jsPDF } from 'jspdf';
import type { ResumeData } from '../types';

export const generatePdf = (data: ResumeData) => {
    const doc = new jsPDF('p', 'pt', 'a4');
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();
    const margin = 40;
    const maxW = pageW - margin * 2;
    let y = margin;

    const checkPageBreak = (neededHeight: number) => {
        if (y + neededHeight > pageH - margin) {
            doc.addPage();
            y = margin;
        }
    };

    // --- Header ---
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(24);
    doc.setTextColor('#1e293b'); // slate-800
    doc.text(data.contact.name, pageW / 2, y, { align: 'center' });
    y += 25;

    let contactLine = `${data.contact.location} • ${data.contact.phone} • ${data.contact.email}`;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor('#475569'); // slate-600
    doc.text(contactLine, pageW / 2, y, { align: 'center' });
    y += 10;
    
    // Links
    if (data.contact.linkedin || data.contact.portfolio) {
        let linkLine = '';
        if(data.contact.linkedin) linkLine += 'LinkedIn';
        if(data.contact.linkedin && data.contact.portfolio) linkLine += ' • ';
        if(data.contact.portfolio) linkLine += 'Portfolio';

        doc.setTextColor('#2563eb'); // blue-600
        doc.textWithLink(linkLine, pageW / 2, y, { align: 'center', url: data.contact.linkedin || data.contact.portfolio });
    }
    y += 30;


    // --- Section Helper ---
    const renderSection = (title: string, body: () => void) => {
        checkPageBreak(40);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor('#1d4ed8'); // blue-700
        doc.text(title.toUpperCase(), margin, y);
        y += 8;
        doc.setDrawColor('#e2e8f0'); // slate-200
        doc.line(margin, y, pageW - margin, y);
        y += 15;
        doc.setFont('helvetica', 'normal');
        doc.setTextColor('#334155'); // slate-700
        doc.setFontSize(10);
        body();
    };

    // --- Summary ---
    renderSection('Summary', () => {
        const summaryLines = doc.splitTextToSize(data.summary, maxW);
        checkPageBreak(summaryLines.length * 12);
        doc.text(summaryLines, margin, y);
        y += summaryLines.length * 12 + 10;
    });

    // --- Experience ---
    renderSection('Experience', () => {
        data.experience.forEach(exp => {
            checkPageBreak(60); // Min height for a job entry
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(11);
            doc.text(exp.role, margin, y);
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(9);
            doc.text(exp.date, pageW - margin, y, { align: 'right' });
            y += 12;

            doc.setFont('helvetica', 'normal');
            doc.setFontSize(10);
            doc.text(exp.company, margin, y);
            doc.setFontSize(9);
            doc.text(exp.location, pageW - margin, y, { align: 'right' });
            y += 15;
            
            exp.description.forEach(desc => {
                const bullet = '•';
                const descLines = doc.splitTextToSize(desc, maxW - 20);
                checkPageBreak(descLines.length * 12);
                doc.text(bullet, margin + 5, y);
                doc.text(descLines, margin + 20, y);
                y += descLines.length * 12;
            });
            y += 10;
        });
    });

     // --- Skills ---
    renderSection('Skills', () => {
        data.skills.forEach(skillCat => {
            checkPageBreak(15);
            doc.setFont('helvetica', 'bold');
            doc.text(`${skillCat.category}:`, margin, y, { maxWidth: 100 });
            doc.setFont('helvetica', 'normal');
            const itemsText = doc.splitTextToSize(skillCat.items.join(', '), maxW - 100);
            doc.text(itemsText, margin + 100, y);
            y += (itemsText.length * 12) + 5;
        });
        y += 10;
    });

    // --- Custom Sections ---
    if(data.customSections && data.customSections.length > 0) {
        data.customSections.forEach(section => {
            renderSection(section.title, () => {
                const contentLines = doc.splitTextToSize(section.content, maxW);
                checkPageBreak(contentLines.length * 12);
                doc.text(contentLines, margin, y);
                y += contentLines.length * 12 + 10;
            });
        });
    }

    // --- Education ---
    renderSection('Education', () => {
        data.education.forEach(edu => {
            checkPageBreak(30);
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(11);
            doc.text(edu.degree, margin, y);
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(9);
            doc.text(edu.date, pageW - margin, y, { align: 'right' });
            y += 12;

            doc.setFont('helvetica', 'normal');
            doc.setFontSize(10);
            doc.text(edu.institution, margin, y);
            y += 15;
        });
    });

    // --- Save ---
    doc.save(`${data.contact.name.replace(' ', '_')}_Resume.pdf`);
};
