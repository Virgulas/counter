import Button from 'react-bootstrap/Button';

export default function ExportToPDF() {
  const handleExportPDF = () => {
    window.print();
  };

  return (
    <>
      <style jsx global>{`
        @media print {
          body {
            background-color: white;
          }
          button {
            display: none;
          }
        }
      `}</style>
      <Button onClick={handleExportPDF}>Exportar</Button>
    </>
  );
}
