import { ProductRecord, ResponsePagination } from "@/types";
import { Pagination, Table } from "@geist-ui/core";
import { useState } from "react";
import useSWR from "swr";

const LIMIT = 15;

function getPaginationQuery(page = 1) {
  const searchParams = new URLSearchParams({
    skip: Math.max(page * LIMIT - LIMIT, 0).toString(),
    limit: LIMIT.toString(),
  });

  return searchParams.toString();
}

export default function ProductsPage() {
  const [pagination, setPagination] = useState({ current: 1, last: 1 });

  const { data, isLoading, error } = useSWR<
    ResponsePagination<{
      products: ProductRecord[];
    }>
  >(
    `https://dummyjson.com/products?${getPaginationQuery(pagination.current)}`,
    {
      onSuccess(data) {
        const { total, skip, limit } = data;
        const maxLimit = Math.max(limit, LIMIT);

        setPagination({
          current: Math.max(skip / maxLimit + 1, 1),
          last: Math.ceil(total / maxLimit),
        });
      },
    }
  );

  return (
    <div style={{ padding: "1rem" }}>
      <Table data={data?.products} emptyText="No data">
        <Table.Column prop="title" label="Product Name" />
        <Table.Column prop="brand" label="Brand" />
        <Table.Column prop="price" label="Price" />
        <Table.Column prop="stock" label="Stock" />
        <Table.Column prop="category" label="Category" />
      </Table>

      <Pagination
        page={pagination.current}
        initialPage={pagination.current}
        count={pagination.last}
        mt={1}
        style={{ textAlign: "center" }}
        onChange={(newPage) => {
          if (newPage !== pagination.current)
            setPagination((prev) => ({ ...prev, current: newPage }));
        }}
      />
    </div>
  );
}
