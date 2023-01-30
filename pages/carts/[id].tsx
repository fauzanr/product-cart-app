import { CARTS_URL, USERS_URL } from "@/endpoints";
import { CartRecord, UserRecord } from "@/types";
import styled from "@emotion/styled";
import {
  Button,
  Description,
  Loading,
  Note,
  Table,
  Text,
  useToasts,
} from "@geist-ui/core";
import { TableColumnRender } from "@geist-ui/core/esm/table";
import { ArrowLeft } from "@geist-ui/icons";
import { GetServerSideProps } from "next";
import Link from "next/link";
import React from "react";
import useSWRImmutable from "swr/immutable";

const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;

  padding: 0.5rem;
  box-shadow: 0px 2px 8px 0px #00000040;
  border-radius: 4px;
`;

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { id } = params as { id: string };

  const res = await fetch(`${CARTS_URL}/${id}`);
  const cart = await res.json();

  return {
    props: {
      cart,
    },
  };
};

export default function CartsPage({ cart }: { cart: CartRecord }) {
  const { setToast } = useToasts();

  const { data: userData, isLoading: userLoading } =
    useSWRImmutable<UserRecord>(
      () => (cart ? `${USERS_URL}/${cart.userId}` : null),
      {
        onError() {
          setToast({ text: "Error fetching user detail", type: "error" });
        },
      }
    );

  const renderProductAmount: TableColumnRender<
    CartRecord["products"][number]
  > = (_, rowData) => {
    const { price, quantity } = rowData;
    return <div style={{ textAlign: "right" }}>{price * quantity}</div>;
  };

  const renderDiscount: TableColumnRender<CartRecord["products"][number]> = (
    value
  ) => {
    return <>{value || 0}%</>;
  };

  return (
    <div style={{ padding: "1rem" }}>
      <Link href="/carts" replace>
        <Button icon={<ArrowLeft />} scale={0.8} type="abort" auto>
          Go back
        </Button>
      </Link>

      <Text h1 py={1}>
        Cart Details
      </Text>

      {cart.id == null ? (
        <Note type="error" label="">
          Cart not found.
        </Note>
      ) : (
        <>
          <Text h3 mb={1}>
            Details
          </Text>
          <DetailGrid>
            <div>
              <Description
                title="User"
                mb={1}
                content={
                  !userLoading ? (
                    userData?.email || cart.userId
                  ) : (
                    <Loading w="20px" />
                  )
                }
              />
              <Description title="# of items" content={cart.totalQuantity} />
            </div>
            <div>
              <Description
                title="Total Amount"
                content={"$" + cart.total}
                mb={1}
              />
              <Description
                title="Discounted Amount"
                content={"$" + cart.discountedTotal}
              />
            </div>
          </DetailGrid>

          <Text h3 mb={1} mt={3}>
            Products
          </Text>
          <div style={{ overflowX: "auto" }}>
            <Table data={cart.products} emptyText="No data">
              <Table.Column prop="title" label="Product Name" />
              <Table.Column prop="price" label="Price" />
              <Table.Column prop="quantity" label="Qty" />
              <Table.Column
                prop="id"
                label="Amount"
                render={renderProductAmount}
              />
              <Table.Column
                prop="discountPercentage"
                label="Discount %"
                render={renderDiscount}
              />
              <Table.Column prop="discountedPrice" label="Discounted" />
            </Table>
          </div>
        </>
      )}
    </div>
  );
}
