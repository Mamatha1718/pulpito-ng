import { useReducer } from "react";
import { DataGrid } from "@material-ui/data-grid";
import { format } from "date-fns";

import { useRuns } from "../../lib/paddles";

function formatDate(orig) {
  if (!orig) return;
  return format(new Date(Date.parse(orig)), "yy-MM-dd HH:mm:ss");
}

function resultsGetter(params) {
  return params.row.results[params.field];
}

const columns = [
  {
    field: "user",
  },
  {
    field: "scheduled",
    type: "date",
    valueFormatter: (row) => formatDate(row.value),
    width: 150,
  },
  {
    field: "started",
    type: "date",
    valueFormatter: (row) => formatDate(row.value),
    width: 150,
  },
  {
    headerName: "updated",
    field: "posted",
    type: "date",
    valueFormatter: (row) => formatDate(row.value),
    width: 150,
  },
  {
    headerName: "runtime",
    field: "",
    valueGetter: (params) => {
      const start = Date.parse(params.row.started);
      const end = Date.parse(params.row.posted);
      if (!end || !start) return null;
      return start - end;
    },
  },
  {
    field: "suite",
  },
  {
    field: "branch",
  },
  {
    field: "machine_type",
  },
  {
    field: "sha1",
    headerName: "hash",
  },
  {
    field: "queued",
    valueGetter: resultsGetter,
  },
  {
    field: "pass",
    valueGetter: resultsGetter,
  },
  {
    field: "fail",
    valueGetter: resultsGetter,
  },
  {
    field: "dead",
    valueGetter: resultsGetter,
  },
  {
    field: "running",
    valueGetter: resultsGetter,
  },
];

export default function RunList(props) {
  const params = props.params;
  const dispatch = props.dispatch;
  const query = useRuns(params);
  if (query.isError) return null;
  return (
    <div style={{ height: 800, width: "100%" }}>
      <div style={{ display: "flex", height: "100%" }}>
        <div style={{ flexGrow: 1 }}>
          <DataGrid
            columns={columns}
            rows={query.data || []}
            loading={query.isLoading || query.isFetching}
            density="compact"
            sortModel={[
              {
                field: "scheduled",
                sort: "desc",
              },
            ]}
            getRowId={(row) => row.name}
            // autoPageSize
            paginationMode="server"
            rowCount={9999}
            hideFooterRowCount
            pageSize={params.pageSize}
            onPageSizeChange={(v) =>
              dispatch({
                type: "set",
                payload: { key: "pageSize", value: v.pageSize },
              })
            }
            page={params.page}
            onPageChange={(v) =>
              dispatch({ type: "set", payload: { key: "page", value: v.page } })
            }
          />
        </div>
      </div>
    </div>
  );
}
