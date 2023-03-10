import CustomPagination from "@/components/customPagination";
import Spin from "@/components/spin";
import { CARTS_URL } from "@/endpoints";
import { CartRecord, ResponsePagination } from "@/types";
import { Button, Table, Text, useToasts } from "@geist-ui/core";
import { TableColumnRender } from "@geist-ui/core/esm/table";
import { Eye } from "@geist-ui/icons";
import Link from "next/link";
import { useState } from "react";
import useSWR from "swr";

export default function CartsPage() {
  const { setToast } = useToasts();
  const [pagination, setPagination] = useState({
    total: 0,
    skip: 0,
    limit: 15,
  });

  const { data, isLoading } = useSWR<
    ResponsePagination<{
      carts: CartRecord[];
    }>
  >(`${CARTS_URL}?skip=${pagination.skip}&limit=${pagination.limit}`, {
    onSuccess(data) {
      const { total, skip } = data;
      setPagination((prev) => ({ ...prev, total, skip }));
    },
    onError() {
      setToast({ text: "Error fetching carts", type: "error" });
    },
  });

  const renderPrice: TableColumnRender<CartRecord> = (value) => <>${value}</>;

  const renderAction: TableColumnRender<CartRecord> = (id) => {
    return (
      <Link href={`/carts/${id}`}>
        <Button auto type="abort" scale={0.5} iconRight={<Eye />}></Button>
      </Link>
    );
  };

  return (
    <div style={{ padding: "1rem" }}>
      <Text h1 py={1}>
        Carts
      </Text>

      <div style={{ overflowX: "auto", minHeight: 200 }}>
        <Spin loading={isLoading}>
          <Table data={data?.carts} emptyText="No data">
            <Table.Column prop="userId" label="User ID" />
            <Table.Column prop="totalProducts" label="Total Products" />
            <Table.Column prop="totalQuantity" label="Total Quantity" />
            <Table.Column
              prop="total"
              label="Total Price"
              render={renderPrice}
            />
            <Table.Column prop="id" width={50} render={renderAction} />
          </Table>
        </Spin>
      </div>

      <CustomPagination pagination={pagination} onChange={setPagination} />
    </div>
  );
}
