export default function ControlLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            body {
              background-color: #c0c0c0 !important;
              font-family: "Times New Roman", Times, serif !important;
              color: #000 !important;
            }
            .retro-container {
              max-width: 800px;
              margin: 0 auto;
              padding: 10px;
            }
            .retro-header {
              background: #000080;
              color: #fff;
              padding: 8px 12px;
              font-family: "Courier New", monospace;
              font-weight: bold;
              font-size: 14px;
              margin-bottom: 10px;
            }
            .retro-panel {
              background: #c0c0c0;
              border: 2px outset #fff;
              padding: 12px;
              margin-bottom: 10px;
            }
            .retro-panel-inset {
              background: #fff;
              border: 2px inset #808080;
              padding: 8px;
              margin-bottom: 8px;
            }
            .retro-btn {
              background: #c0c0c0;
              border: 2px outset #fff;
              padding: 4px 16px;
              font-family: "MS Sans Serif", Arial, sans-serif;
              font-size: 12px;
              cursor: pointer;
              min-width: 75px;
            }
            .retro-btn:active {
              border-style: inset;
            }
            .retro-btn-danger {
              background: #c0c0c0;
              border: 2px outset #fff;
              padding: 4px 16px;
              font-family: "MS Sans Serif", Arial, sans-serif;
              font-size: 12px;
              cursor: pointer;
              color: #800000;
              font-weight: bold;
            }
            .retro-btn-danger:active {
              border-style: inset;
            }
            .retro-input {
              background: #fff;
              border: 2px inset #808080;
              padding: 4px 6px;
              font-family: "Courier New", monospace;
              font-size: 14px;
              width: 100%;
              box-sizing: border-box;
            }
            .retro-textarea {
              background: #fff;
              border: 2px inset #808080;
              padding: 4px 6px;
              font-family: "Courier New", monospace;
              font-size: 13px;
              width: 100%;
              box-sizing: border-box;
              resize: vertical;
            }
            .retro-table {
              width: 100%;
              border-collapse: collapse;
              font-family: "MS Sans Serif", Arial, sans-serif;
              font-size: 12px;
            }
            .retro-table th {
              background: #000080;
              color: #fff;
              padding: 4px 8px;
              text-align: left;
              font-weight: normal;
            }
            .retro-table td {
              padding: 4px 8px;
              border-bottom: 1px solid #808080;
            }
            .retro-table tr:nth-child(even) {
              background: #d4d0c8;
            }
            .retro-link {
              color: #0000ff;
              text-decoration: underline;
              cursor: pointer;
            }
            .retro-link:visited {
              color: #800080;
            }
            .retro-hr {
              border: none;
              border-top: 1px solid #808080;
              border-bottom: 1px solid #fff;
              margin: 10px 0;
            }
            .retro-label {
              font-family: "MS Sans Serif", Arial, sans-serif;
              font-size: 12px;
              display: block;
              margin-bottom: 4px;
              font-weight: bold;
            }
            .retro-status {
              background: #c0c0c0;
              border: 2px inset #808080;
              padding: 2px 8px;
              font-family: "MS Sans Serif", Arial, sans-serif;
              font-size: 11px;
              color: #000;
              margin-top: 10px;
            }
            .retro-checkbox {
              margin-right: 6px;
            }
            .marquee-bar {
              background: #000080;
              color: #ffff00;
              padding: 2px 8px;
              font-family: "Courier New", monospace;
              font-size: 11px;
              overflow: hidden;
              white-space: nowrap;
            }
          `,
        }}
      />
      {children}
    </>
  );
}
