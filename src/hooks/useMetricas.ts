"use client";

import { useState, useEffect } from "react";
import { getMetricas, Metricas } from "@/services/metricasService";

export const useMetricas = () => {
  const [metricas, setMetricas] = useState<Metricas | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetricas = async () => {
      try {
        setLoading(true);
        const data = await getMetricas();
        setMetricas(data);
      } catch (err) {
        setError("Não foi possível carregar as métricas.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMetricas();
  }, []);

  return { metricas, loading, error };
};
