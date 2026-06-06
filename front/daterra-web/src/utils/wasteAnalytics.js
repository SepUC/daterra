const DEFAULT_ERROR_MESSAGE = 'No fue posible cargar los datos de residuos.';

function normalizeLabel(entry) {
  return entry?.nombre || entry?.name || entry?.label || 'Sin dato';
}

function normalizeValue(entry) {
  const value = Number(entry?.total);
  return Number.isFinite(value) ? value : 0;
}

function toChartItem(entry) {
  return {
    label: normalizeLabel(entry),
    value: normalizeValue(entry),
  };
}

function buildRows(items, total) {
  return items.map((item) => ({
    ...item,
    percentage: total > 0 ? (item.value / total) * 100 : 0,
  }));
}

export function formatToneladas(value) {
  return new Intl.NumberFormat('es-CL', {
    maximumFractionDigits: 1,
    minimumFractionDigits: 0,
  }).format(Number(value) || 0);
}

export function normalizeDashboardError(error) {
  if (!error) {
    return DEFAULT_ERROR_MESSAGE;
  }

  if (typeof error === 'string') {
    return error;
  }

  if (error instanceof Error) {
    return error.message || DEFAULT_ERROR_MESSAGE;
  }

  return error.message || DEFAULT_ERROR_MESSAGE;
}

export function buildWasteDashboardData(regions = [], treatments = []) {
  const regionData = regions
    .map(toChartItem)
    .filter((item) => item.label !== 'Sin dato' || item.value > 0)
    .sort((left, right) => right.value - left.value);

  const treatmentData = treatments
    .map(toChartItem)
    .filter((item) => item.label !== 'Sin dato' || item.value > 0)
    .sort((left, right) => right.value - left.value);

  const totalToneladas = regionData.reduce((accumulator, item) => accumulator + item.value, 0);
  const totalTratamientos = treatmentData.reduce((accumulator, item) => accumulator + item.value, 0);

  const regionsWithPercentage = buildRows(regionData, totalToneladas);

  return {
    regionData: regionsWithPercentage,
    treatmentData,
    metrics: {
      totalToneladas,
      regionCount: regionData.length,
      treatmentCount: treatmentData.length,
      averagePerRegion: regionData.length ? totalToneladas / regionData.length : 0,
      topRegion: regionData[0] || null,
      topTreatment: treatmentData[0] || null,
      totalTratamientos,
    },
    hasData: totalToneladas > 0 || totalTratamientos > 0,
  };
}