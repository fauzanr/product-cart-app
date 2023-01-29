import { Text, useToasts } from "@geist-ui/core";
import { ChartData, ChartOptions } from "chart.js";
import React, { useEffect, useState } from "react";
import useSWRImmutable from "swr/immutable";
import { PRODUCTS_URL } from "@/endpoints";
import { ProductRecord, ResponsePagination } from "@/types";
import Spin from "@/components/spin";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const chartOptions: ChartOptions<"bar"> = {
  indexAxis: "y" as const,
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      ticks: {
        stepSize: 1,
      },
    },
  },
};

const defaultChartData: ChartData<"bar"> = {
  labels: [],
  datasets: [
    {
      label: "# of items",
      data: [],
      backgroundColor: ["rgba(54, 162, 235, 0.2)"],
      borderColor: ["rgba(54, 162, 235, 1)"],
      borderWidth: 1,
    },
  ],
};

const Dashboard = () => {
  const [chartData, setChartData] = useState(defaultChartData);
  const [brands, setBrands] = useState<Record<string, number>>({});
  const { setToast } = useToasts();

  const { data, isLoading } = useSWRImmutable<
    ResponsePagination<{ products: ProductRecord[] }>
  >(`${PRODUCTS_URL}?limit=100`, {
    onError() {
      setToast({ text: "Error fetching brands", type: "error" });
    },
  });

  useEffect(() => {
    if (!data?.products) return;

    const newBrands = { ...brands };
    data.products.forEach((p) => {
      if (newBrands[p.brand]) {
        newBrands[p.brand] += 1;
      } else {
        newBrands[p.brand] = 1;
      }
    });
    setBrands(newBrands);

    setChartData((prev) => {
      const newData = { ...prev };

      newData.labels = Object.keys(newBrands);
      newData.datasets[0].data = Object.values(newBrands);

      return newData;
    });
  }, [data]);

  const brandCount = chartData.labels?.length || 0;

  return (
    <div style={{ padding: "1rem" }}>
      <Text h1 py={1}>
        Admin Dashboard
      </Text>

      <Text h3 pt={1}>
        Brands {brandCount > 0 ? `(${brandCount})` : ""}
      </Text>
      <Spin loading={isLoading}>
        <div style={{ height: 1800 }}>
          <Bar data={chartData} options={chartOptions} redraw />
        </div>
      </Spin>
    </div>
  );
};

export default Dashboard;
