import CustomPagination from "@/components/customPagination";
import Spin from "@/components/spin";
import { PRODUCTS_URL } from "@/endpoints";
import { debounce } from "@/hooks/useDebounce";
import { ProductRecord, ResponsePagination } from "@/types";
import styled from "@emotion/styled";
import { Button, Input, Table, Text, useToasts } from "@geist-ui/core";
import { Filter } from "@geist-ui/icons";
import { ChangeEvent, useState } from "react";
import useSWR from "swr";

const ActionContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1rem;
  gap: 0.5rem;
`;

export default function ProductsPage() {
  const { setToast } = useToasts();
  const [keyword, setKeyword] = useState("");
  const [query, setQuery] = useState(keyword);
  const [pagination, setPagination] = useState({
    total: 0,
    skip: 0,
    limit: 15,
  });

  const { data, isLoading } = useSWR<
    ResponsePagination<{
      products: ProductRecord[];
    }>
  >(
    `${PRODUCTS_URL}/search?q=${query}&skip=${pagination.skip}&limit=${pagination.limit}`,
    {
      onSuccess(data) {
        const { total, skip } = data;
        setPagination((prev) => ({ ...prev, total, skip }));
      },
      onError() {
        setToast({ text: "Error fetching products", type: "error" });
      },
    }
  );

  const onChangeKeyword = (e: ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
    debounce(() => {
      setQuery(e.target.value);
      setPagination((prev) => ({ ...prev, skip: 0 }));
    });
  };

  return (
    <div style={{ padding: "1rem" }}>
      <Text h1 py={1}>
        Products
      </Text>

      <ActionContainer>
        <Button iconRight={<Filter />} h={0.9} ghost auto>
          Filter
        </Button>
        <Input
          value={keyword}
          placeholder="Search Product"
          clearable
          onChange={onChangeKeyword}
        />
      </ActionContainer>

      <div style={{ overflowX: "auto" }}>
        <Spin loading={isLoading}>
          <Table data={data?.products} emptyText="No data">
            <Table.Column prop="title" label="Product Name" />
            <Table.Column prop="brand" label="Brand" />
            <Table.Column prop="price" label="Price" />
            <Table.Column prop="stock" label="Stock" />
            <Table.Column prop="category" label="Category" />
          </Table>
        </Spin>
      </div>

      <CustomPagination pagination={pagination} onChange={setPagination} />
    </div>
  );
}
