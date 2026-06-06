import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildWasteDashboardData,
  formatToneladas,
  normalizeDashboardError,
} from './wasteAnalytics.js';

test('buildWasteDashboardData normaliza agregados de residuos', () => {
  const result = buildWasteDashboardData(
    [
      { nombre: 'Región Metropolitana', total: '120.4' },
      { nombre: 'Biobío', total: 80 },
    ],
    [
      { nombre: 'Reciclaje', total: 150 },
      { nombre: 'Compostaje', total: 50 },
    ],
  );

  assert.equal(result.hasData, true);
  assert.equal(result.metrics.totalToneladas, 200.4);
  assert.equal(result.metrics.regionCount, 2);
  assert.equal(result.metrics.treatmentCount, 2);
  assert.equal(result.metrics.topRegion?.label, 'Región Metropolitana');
  assert.equal(result.metrics.topTreatment?.label, 'Reciclaje');
  assert.equal(formatToneladas(result.metrics.totalToneladas), '200,4');
  assert.equal(result.regionData[0].percentage > result.regionData[1].percentage, true);
});

test('buildWasteDashboardData devuelve estado vacío sin datos', () => {
  const result = buildWasteDashboardData([], []);

  assert.equal(result.hasData, false);
  assert.equal(result.metrics.totalToneladas, 0);
  assert.equal(result.metrics.averagePerRegion, 0);
  assert.deepEqual(result.regionData, []);
  assert.deepEqual(result.treatmentData, []);
});

test('normalizeDashboardError prioriza mensajes legibles', () => {
  assert.equal(normalizeDashboardError('Backend sin respuesta'), 'Backend sin respuesta');
  assert.equal(normalizeDashboardError(new Error('Timeout')), 'Timeout');
  assert.equal(normalizeDashboardError(null), 'No fue posible cargar los datos de residuos.');
});