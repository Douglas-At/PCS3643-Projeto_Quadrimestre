import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Chart,
  ChartConfiguration,
  registerables,
} from 'chart.js';
import { IbgeDataRecord } from '../../../../core/models/ibge-data.model.ts';

Chart.register(...registerables); 

@Component({
  selector: 'app-ibge-data-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ibge-data-chart.component.html',
})
export class IbgeDataChartComponent
  implements AfterViewInit, OnChanges, OnDestroy
{
  @Input() data: IbgeDataRecord[] = [];
  @Input() variavelSelecionada: string | 'todos' = 'todos';

  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;

  private chart?: Chart<'line'>;

  ngAfterViewInit(): void {
    this.buildChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.chart && (changes['data'] || changes['variavelSelecionada'])) {
      this.updateChart();
    }
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }

  private buildChart() {
    if (!this.chartCanvas) return;

    const { labels, valores } = this.getChartData();

    const config: ChartConfiguration<'line'> = {
  type: 'line', // <- sem "as ChartType"
  data: {
    labels,
    datasets: [
      {
        data: valores,
        label:
          this.variavelSelecionada === 'todos'
            ? 'Valor agregado'
            : String(this.variavelSelecionada),
        borderColor: '#22d3ee',
        backgroundColor: 'rgba(34,211,238,0.25)',
        tension: 0.3,
        fill: true,
      },
    ],
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        labels: { color: '#e5e7eb' },
      },
    },
    scales: {
      x: {
        ticks: { color: '#9ca3af' },
        grid: { color: '#1f2937' },
      },
      y: {
        ticks: { color: '#9ca3af' },
        grid: { color: '#1f2937' },
      },
    },
  },
};


    this.chart = new Chart(this.chartCanvas.nativeElement, config);
  }

  private updateChart() {
    if (!this.chart) return;

    const { labels, valores } = this.getChartData();

    this.chart.data.labels = labels;
    this.chart.data.datasets[0].data = valores;
    this.chart.data.datasets[0].label =
      this.variavelSelecionada === 'todos'
        ? 'Valor agregado'
        : String(this.variavelSelecionada);

    this.chart.update();
  }
  private getChartData(): { labels: (number | string)[]; valores: number[] } {
  const dados = this.data ?? [];

  const anos = Array.from(new Set(dados.map((d) => d.ano))).sort(
    (a, b) => a - b
  );

  const valoresPorAno = anos.map(
    (ano) =>
      dados
        .filter((d) => d.ano === ano)
        .reduce((acc, d) => acc + d.valor, 0)
  );

  return {
    labels: anos,
    valores: valoresPorAno,
  };
}

}
