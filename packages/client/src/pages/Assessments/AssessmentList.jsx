import { useEffect, useState } from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { AssessmentService } from '../../services/AssessmentService';

// Helper function for status badge styling - KEEP ONLY THIS ONE
function getStatusBadgeClass(status) {
  switch (status?.toLowerCase()) {
    case `active`:
      return `badge-success`;
    case `inactive`:
      return `badge-secondary`;
    case `pending`:
      return `badge-warning`;
    case `completed`:
      return `badge-info`;
    default:
      return `badge-light`;
  }
}

// Action handlers
const handleEdit = (id) => {
  console.log(`Edit assessment:`, id);
  // Implement edit functionality
};

const handleDelete = async (id) => {
  if (window.confirm(`Are you sure you want to delete this assessment?`)) {
    try {
      await AssessmentService.delete(id);
      // You might want to refresh the data here
      window.location.reload(); // Simple approach, or better: refetch data
    } catch (error) {
      console.error(`Error deleting assessment:`, error);
      alert(`Failed to delete assessment`);
    }
  }
};

const columnHelper = createColumnHelper();

const columns = [
  columnHelper.accessor(`id`, {
    cell: (info) => info.getValue(),
    footer: (info) => info.column.id,
    header: `ID`,
  }),
  columnHelper.accessor(`catName`, {
    cell: (info) => info.getValue(),
    footer: (info) => info.column.id,
    header: `catName`,
  }),
  columnHelper.accessor(`catDateOfBirth`, {
    cell: (info) => <span title={info.getValue()}>{info.getValue()}</span>,
    footer: (info) => info.column.id,
    header: `catDateOfBirth`,
  }),
  columnHelper.accessor(`Age`, {
    cell: (info) =>
      <span className={`badge ${getStatusBadgeClass(info.getValue())}`}>
        {info.getValue()}
      </span>,
    footer: (info) => info.column.id,
    header: `Age`,
  }),
  columnHelper.accessor(`createdAt`, {
    cell: (info) => new Date(info.getValue()).toLocaleDateString(),
    footer: (info) => info.column.id,
    header: `Created Date`,
  }),
  columnHelper.accessor(`updatedAt`, {
    cell: (info) => new Date(info.getValue()).toLocaleDateString(),
    footer: (info) => info.column.id,
    header: `Last Updated`,
  }),
  // Actions column
  columnHelper.display({
    id: `actions`,
    cell: ({ row }) =>
      <div className="action-buttons">
        <button
          onClick={() => handleEdit(row.original.id)}
          className="btn btn-sm btn-primary me-2"
        >
          Edit
        </button>
        <button
          onClick={() => handleDelete(row.original.id)}
          className="btn btn-sm btn-danger"
        >
          Delete
        </button>
      </div>,
    footer: (info) => info.column.id,
    header: `Actions`,
  }),
];

export const AssessmentList = () => {
  const [ assessments, setAssessments ] = useState([]);
  const [ loading, setLoading ] = useState(true);
  const [ error, setError ] = useState(null);

  // Fetch all assessments using the AssessmentService.getList function
  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        setLoading(true);
        const data = await AssessmentService.getList();
        setAssessments(data);
        setError(null);
      } catch (err) {
        setError(`Failed to load assessments`);
        console.error(`Error fetching assessments:`, err);
      } finally {
        setLoading(false);
      }
    };
    fetchAssessments();
  }, []);

  const table = useReactTable({
    columns,
    data: assessments,
    getCoreRowModel: getCoreRowModel(),
  });

  if (loading) {
    return <div className="d-flex justify-content-center align-items-center" style={{ height: `200px` }}>
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>;
  }

  if (error) {
    return <div className="alert alert-danger" role="alert">
      {error}
    </div>;
  }

  return <div className="assessment-list p-4">
    <div className="d-flex justify-content-between align-items-center mb-4">
      <h2>Assessments</h2>
      <button className="btn btn-primary">
        Add New Assessment
      </button>
    </div>

    <div className="table-responsive">
      <table className="table table-striped table-hover">
        <thead className="table-dark">
          {table.getHeaderGroups().map((headerGroup) =>
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) =>
                <th key={header.id}>
                  {header.isPlaceholder ?
                    null :
                      flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </th>)}
            </tr>)}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) =>
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) =>
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>)}
            </tr>)}
        </tbody>
        <tfoot>
          {table.getFooterGroups().map((footerGroup) =>
            <tr key={footerGroup.id}>
              {footerGroup.headers.map((header) =>
                <th key={header.id}>
                  {header.isPlaceholder ?
                    null :
                      flexRender(
                        header.column.columnDef.footer,
                        header.getContext(),
                      )}
                </th>)}
            </tr>)}
        </tfoot>
      </table>
    </div>

    {assessments.length === 0 &&
      <div className="text-center py-4">
        <p className="text-muted">No assessments found.</p>
      </div>}
  </div>;
};
