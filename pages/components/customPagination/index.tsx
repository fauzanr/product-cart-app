import { Pagination } from "@geist-ui/core";
import React from "react";

const CustomPagination = ({
  pagination,
  onChange,
}: {
  pagination: {
    skip: number;
    total: number;
    limit: number;
  };
  onChange?: ({
    skip,
    limit,
    total,
  }: {
    skip: number;
    limit: number;
    total: number;
  }) => void;
}) => {
  const { skip, total, limit } = pagination;

  const current = Math.max(skip / limit + 1, 1);
  const last = Math.ceil(total / limit);

  function getPaginationQuery(page = 1) {
    return {
      skip: Math.max(page * limit - limit, 0),
      limit,
      total,
    };
  }

  return (
    <Pagination
      page={current}
      initialPage={current}
      count={last}
      mt={1}
      style={{ textAlign: "center" }}
      onChange={(newPage) => {
        if (newPage !== current) onChange?.(getPaginationQuery(newPage));
      }}
    />
  );
};

export default CustomPagination;
