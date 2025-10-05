import * as docx from 'docx';
import saveAs from 'file-saver';
import type { ResumeData } from '../types';

export const generateDocx = (data: ResumeData) => {
    const contactChildren: (docx.TextRun | docx.Hyperlink)[] = [];

    contactChildren.push(new docx.TextRun(data.contact.location));
    contactChildren.push(new docx.TextRun(" | "));
    contactChildren.push(new docx.TextRun(data.contact.phone));
    contactChildren.push(new docx.TextRun(" | "));

    // Email Hyperlink
    contactChildren.push(new docx.Hyperlink({
        child: new docx.TextRun({ text: data.contact.email, style: "Hyperlink" }),
        link: `mailto:${data.contact.email}`,
    }));

    // LinkedIn Hyperlink
    if (data.contact.linkedin) {
        contactChildren.push(new docx.TextRun(" | "));
        contactChildren.push(new docx.Hyperlink({
            child: new docx.TextRun({ text: 'LinkedIn', style: "Hyperlink" }),
            link: data.contact.linkedin,
        }));
    }

    // Portfolio Hyperlink
    if (data.contact.portfolio) {
        contactChildren.push(new docx.TextRun(" | "));
        contactChildren.push(new docx.Hyperlink({
            child: new docx.TextRun({ text: 'Portfolio', style: "Hyperlink" }),
            link: data.contact.portfolio,
        }));
    }
    
    const headingBorderStyle = { bottom: { style: docx.BorderStyle.SINGLE, size: 6, color: "auto", space: 1 } };

    const doc = new docx.Document({
        styles: {
            characterStyles: [
                {
                    id: 'Hyperlink',
                    name: 'Hyperlink',
                    basedOn: 'DefaultParagraphFont',
                    run: {
                        color: '0000FF',
                        underline: {
                            type: docx.UnderlineType.SINGLE,
                        },
                    },
                },
            ],
        },
        sections: [{
            children: [
                new docx.Paragraph({
                    text: data.contact.name,
                    heading: docx.HeadingLevel.HEADING_1,
                    alignment: docx.AlignmentType.CENTER,
                }),
                new docx.Paragraph({
                    alignment: docx.AlignmentType.CENTER,
                    children: contactChildren,
                }),

                new docx.Paragraph({ text: "Summary", heading: docx.HeadingLevel.HEADING_2, border: headingBorderStyle }),
                new docx.Paragraph(data.summary),
                new docx.Paragraph(" "),

                new docx.Paragraph({ text: "Experience", heading: docx.HeadingLevel.HEADING_2, border: headingBorderStyle }),
                ...data.experience.flatMap(exp => [
                    new docx.Paragraph({
                        children: [
                            new docx.TextRun({ text: exp.role, bold: true }),
                            new docx.TextRun({ text: `\t${exp.date}`, }),
                        ],
                        tabStops: [{ type: docx.TabStopType.RIGHT, position: docx.TabStopPosition.MAX }]
                    }),
                    new docx.Paragraph({
                        children: [
                            new docx.TextRun({ text: exp.company, italics: true }),
                            new docx.TextRun({ text: `\t${exp.location}`, italics: true }),
                        ],
                        tabStops: [{ type: docx.TabStopType.RIGHT, position: docx.TabStopPosition.MAX }]
                    }),
                    ...exp.description.map(desc => new docx.Paragraph({ text: desc, bullet: { level: 0 } })),
                    new docx.Paragraph(" "),
                ]),

                new docx.Paragraph({ text: "Skills", heading: docx.HeadingLevel.HEADING_2, border: headingBorderStyle }),
                ...data.skills.map(skillCat => new docx.Paragraph({
                    children: [
                        new docx.TextRun({ text: `${skillCat.category}: `, bold: true }),
                        new docx.TextRun(skillCat.items.join(', ')),
                    ]
                })),
                new docx.Paragraph(" "),

                ...(data.customSections || []).flatMap(section => [
                    new docx.Paragraph({ text: section.title, heading: docx.HeadingLevel.HEADING_2, border: headingBorderStyle }),
                    new docx.Paragraph(section.content),
                    new docx.Paragraph(" "),
                ]),

                new docx.Paragraph({ text: "Education", heading: docx.HeadingLevel.HEADING_2, border: headingBorderStyle }),
                ...data.education.map(edu => new docx.Paragraph({
                    children: [
                        new docx.TextRun({ text: edu.degree, bold: true }),
                        new docx.TextRun({ text: `\t${edu.date}` }),
                    ],
                    tabStops: [{ type: docx.TabStopType.RIGHT, position: docx.TabStopPosition.MAX }]
                })),
                ...data.education.map(edu => new docx.Paragraph({ text: edu.institution, italics: true })),
            ],
        }],
    });

    docx.Packer.toBlob(doc).then(blob => {
        saveAs(blob, `${data.contact.name.replace(' ', '_')}_Resume.docx`);
    });
};