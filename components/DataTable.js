import { Table } from 'react-bootstrap';

export default function DataTable({ columns, data }) {
  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col}>{col}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.length === 0 ? (
          <tr>
            <td colSpan={columns.length} className="text-center">
              No data available.
            </td>
          </tr>
        ) : (
          data.map((row, index) => (
            <tr key={index}>
              {Object.keys(row).map((key) => (
                <td key={key}>{row[key]}</td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </Table>
  );
}
