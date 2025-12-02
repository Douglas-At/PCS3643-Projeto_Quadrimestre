import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IbgeDataRecord } from '../../core/models/ibge-data.model';
import { DashboardDataService } from '../../core/api/dashboard-data.service';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.page.html',
})
export class DashboardPage implements OnInit {
  private readonly _allData = signal<IbgeDataRecord[]>([]);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  selectedLocal = signal<string>('Brasil');
  selectedVariavel = signal<string | 'todos'>('todos');
  selectedMedida = signal<'todas' | 'numero' | 'percentual'>('todas');
  selectedSexo = signal<'Total' | 'Homens' | 'Mulheres'>('Total');
  selectedIdadeInicio = signal<number | null>(null);
  selectedIdadeFim = signal<number | null>(null);

  locaisDisponiveis = signal<string[]>([]);
  variaveisDisponiveis = signal<string[]>([]);

  readonly idadeInicioOptions = [
    0, 5, 10, 15, 20, 25, 30, 35, 40, 45,
    50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100,
  ];

  readonly idadeFimOptions = [
     4,  9, 14, 19, 24, 29, 34, 39, 44, 49,
    54, 59, 64, 69, 74, 79, 84, 89, 94, 99, 120,
  ];

  // -----------------------------------------
  // Dados filtrados
  // -----------------------------------------
  dadosFiltrados = computed<IbgeDataRecord[]>(() => {
    let dados = this._allData();

    const local = this.selectedLocal();
    const variavel = this.selectedVariavel();
    const medida = this.selectedMedida();
    const sexo = this.selectedSexo();
    const idadeInicio = this.selectedIdadeInicio();
    const idadeFim = this.selectedIdadeFim();

    // Local sempre obrigatório
    dados = dados.filter((d) => d.local === local);

    if (variavel !== 'todos') {
      dados = dados.filter((d) => d.variavel === variavel);
    }

    if (medida !== 'todas') {
      dados = dados.filter((d) => {
        const v = d.variavel.toLowerCase();

        if (medida === 'numero') {
          return (
            v.includes('pessoas') ||
            v.includes('(pessoas)') ||
            v.includes('quantidade') ||
            v.includes('número')
          );
        }

        return v.includes('%') || v.includes('percentual') || v.includes('taxa');
      });
    }

    dados = dados.filter((d) => this.normalizaSexo(d.sexo) === sexo);

    if (idadeInicio !== null || idadeFim !== null) {
      dados = dados.filter((d) => {
        const faixa = this.parseFaixaEtaria(d.idade);
        const ini = idadeInicio ?? 0;
        const fim = idadeFim ?? 120;
        return faixa.inicio >= ini && faixa.fim <= fim;
      });
    }

    return dados;
  });

  // -----------------------------------------
  // Resumo por faixa etária
  // -----------------------------------------
  resumoPorIdade = computed<{ idade: string; total: number }[]>(() => {
    const mapa = new Map<string, number>();

    const dadosSemTotal = this.dadosFiltrados().filter(
      (d) => d.idade !== 'Total'
    );

    dadosSemTotal.forEach((d) => {
      mapa.set(d.idade, (mapa.get(d.idade) ?? 0) + (d.valor ?? 0));
    });

    return Array.from(mapa.entries())
      .map(([idade, total]) => ({ idade, total }))
      .sort(
        (a, b) =>
          this.parseFaixaEtaria(a.idade).inicio -
          this.parseFaixaEtaria(b.idade).inicio,
      );
  });

  // -----------------------------------------
  // Soma dos valores (único card agora)
  // -----------------------------------------
  somaValores = computed(() => {
    const dados = this.dadosFiltrados();
    if (!dados.length) return 0;

    const totais = dados.filter((d) => d.idade === 'Total');
    if (totais.length) {
      return totais.reduce((acc, d) => acc + (d.valor ?? 0), 0);
    }

    return dados.reduce((acc, d) => acc + (d.valor ?? 0), 0);
  });

  totalRegistros = computed(() => this.dadosFiltrados().length);

  // -----------------------------------------
  constructor(private dashboardService: DashboardDataService) {}
  ngOnInit(): void {
    this.carregarDados();
  }

  // -----------------------------------------
  private carregarDados(): void {
    this.loading.set(true);
    this.error.set(null);

    this.dashboardService.getDashboardData().subscribe({
      next: (dados) => {
        this._allData.set(dados);
        this.loading.set(false);

        const locais = Array.from(new Set(dados.map((d) => d.local))).sort();
        const variaveis = Array.from(new Set(dados.map((d) => d.variavel))).sort();

        this.locaisDisponiveis.set(locais);
        this.variaveisDisponiveis.set(variaveis);

        if (!locais.includes(this.selectedLocal())) {
          this.selectedLocal.set(locais[0]);
        }
      },
      error: (err) => {
        console.error(err);
        this.error.set('Erro ao buscar dados.');
        this.loading.set(false);
      },
    });
  }

  // -----------------------------------------
  onLocalChange(v: string) {
    this.selectedLocal.set(v);
  }
  onVariavelChange(v: string) {
    this.selectedVariavel.set(v);
  }

  setMedidaFilter(v: any) {
    this.selectedMedida.set(v);
  }
  setSexoFilter(v: any) {
    this.selectedSexo.set(v);
  }

  onIdadeInicioChange(v: any) {
    this.selectedIdadeInicio.set(v === null ? null : Number(v));
  }
  onIdadeFimChange(v: any) {
    this.selectedIdadeFim.set(v === null ? null : Number(v));
  }

  // -----------------------------------------
  private normalizaSexo(sexoBruto: string): 'Total' | 'Homens' | 'Mulheres' {
  const s = sexoBruto.toLowerCase().trim();

  // 1) Checa primeiro mulheres
  if (
    s.includes('mulher') ||
    s.includes('mulheres') ||
    s.includes('fem') ||
    s === 'f'
  ) {
    return 'Mulheres';
  }

  // 2) Depois homens
  if (
    s.includes('homem') ||
    s.includes('homens') ||
    s.includes('masc') ||
    s === 'm'
  ) {
    return 'Homens';
  }
  return 'Total';
}


  private parseFaixaEtaria(txt: string) {
    const raw = txt.toLowerCase().trim();
    if (raw === 'total') return { inicio: 0, fim: 120 };

    if (raw.startsWith('100')) return { inicio: 100, fim: 120 };

    const m = raw.match(/(\d+)\s*a\s*(\d+)/);
    if (m) return { inicio: +m[1], fim: +m[2] };

    return { inicio: 0, fim: 120 };
  }
}
