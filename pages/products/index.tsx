import { PRODUCTS_URL } from "@/endpoints";
import useDebounce from "@/hooks/useDebounce";
import { ProductRecord, ResponsePagination } from "@/types";
import styled from "@emotion/styled";
import { Button, Input, Table } from "@geist-ui/core";
import { Filter } from "@geist-ui/icons";
import { FormEvent, useRef, useState } from "react";
import useSWR from "swr";
import CustomPagination from "../components/customPagination";

const ActionContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1rem;
  gap: 0.5rem;
`;

export default function ProductsPage() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query);
  const [pagination, setPagination] = useState({
    total: 0,
    skip: 0,
    limit: 15,
  });

  const { data, isLoading, error } = useSWR<
    ResponsePagination<{
      products: ProductRecord[];
    }>
  >(
    `${PRODUCTS_URL}/search?q=${debouncedQuery}&skip=${pagination.skip}&limit=${pagination.limit}`,
    {
      onSuccess(data) {
        const { total, skip } = data;
        setPagination((prev) => ({ ...prev, total, skip }));
      },
    }
  );

  const onSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <div style={{ padding: "1rem" }}>
      <ActionContainer>
        <Button iconRight={<Filter />} h={0.9} ghost auto>
          Filter
        </Button>
        <form onSubmit={onSearch}>
          <Input
            value={query}
            placeholder="Search Product"
            clearable
            onChange={(e) => setQuery(e.target.value)}
          />
        </form>
      </ActionContainer>

      <Table data={data?.products} emptyText="No data">
        <Table.Column prop="title" label="Product Name" />
        <Table.Column prop="brand" label="Brand" />
        <Table.Column prop="price" label="Price" />
        <Table.Column prop="stock" label="Stock" />
        <Table.Column prop="category" label="Category" />
      </Table>

      <CustomPagination pagination={pagination} onChange={setPagination} />
    </div>
  );
}
