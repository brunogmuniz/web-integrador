import { Component } from '@angular/core';

@Component({
  selector: 'app-area-tabela',
  templateUrl: './area-tabela.html',
  styleUrls: ['./area-tabela.css']
})
export class AreaTabelaComponent {
  inputBusca = '';

  areas = [
    {id: 1, codigo: 'MAB', nome: 'Matemática', media: 23.2, nrDocentes: 12, ano2024s1: 100, ano2024s2: 100, ano2025s1: 130, ano2025s2: 130, ano2026s1: 120, ano2026s2: 120, ano2027s1: 130, ano2027s2: 130,
      subareas: [
        { id: 101, codigo: 'MATF',  nome: 'Matemática Financeira', media: 18.2, nrDocentes: 4, ano2024s1: 40, ano2024s2: 35, ano2025s1: 45, ano2025s2: 40, ano2026s1: 38, ano2026s2: 40, ano2027s1: 42, ano2027s2: 45 },
        { id: 102, codigo: 'EST', nome: 'Estatística', media: 25.3, nrDocentes: 5, ano2024s1: 60, ano2024s2: 65, ano2025s1: 70, ano2025s2: 75, ano2026s1: 68, ano2026s2: 70, ano2027s1: 73, ano2027s2: 75 }
      ]
    },
    {id: 85, codigo: 'CTA', nome: 'Ciência e Tecnologia de Alimentos', media: 22, nrDocentes: 90, ano2024s1: 75, ano2024s2: 78, ano2025s1: 82, ano2025s2: 85, ano2026s1: 88, ano2026s2: 90, ano2027s1: 52, ano2027s2: 52,
      subareas: [
        { id: 851, codigo: 'CALI', nome: 'Ciência de Alimentos', media: 1.6, nrDocentes: 3, ano2024s1: 22, ano2024s2: 24, ano2025s1: 26, ano2025s2: 27, ano2026s1: 29, ano2026s2: 30, ano2027s1: 31, ano2027s2: 33 },
      ]
    },
    {id: 85, codigo: 'EST', nome: 'Estatística', media: 17, nrDocentes: 2, ano2024s1: 75, ano2024s2: 78, ano2025s1: 82, ano2025s2: 85, ano2026s1: 88, ano2026s2: 90, ano2027s1: 52, ano2027s2: 52,
      subareas: [
        { id: 851, codigo: 'ESTA', nome: 'Estatística Geral', media: 16, nrDocentes: 3, ano2024s1: 22, ano2024s2: 24, ano2025s1: 26, ano2025s2: 27, ano2026s1: 29, ano2026s2: 30, ano2027s1: 31, ano2027s2: 33 },
      ]
    },

    {id: 2, codigo: 'CCO', nome: 'Ciência da Computação', media: 15.22, nrDocentes: 10, ano2024s1: 100, ano2024s2: 100, ano2025s1: 100, ano2025s2: 130, ano2026s1: 130, ano2026s2: 120, ano2027s1: 120, ano2027s2: 130,
      subareas: [
        { id: 201, codigo: 'LGPR', nome: 'Programação', media: 12.5, nrDocentes: 3, ano2024s1: 30, ano2024s2: 25, ano2025s1: 35, ano2025s2: 40, ano2026s1: 38, ano2026s2: 40, ano2027s1: 42, ano2027s2: 45 },
        { id: 202, codigo: 'BD', nome: 'Banco de Dados', media: 16.8, nrDocentes: 2, ano2024s1: 20, ano2024s2: 30, ano2025s1: 40, ano2025s2: 45, ano2026s1: 50, ano2026s2: 45, ano2027s1: 48, ano2027s2: 50 },
        { id: 203, codigo: 'EGSFTW', nome: 'Enhenharia de Software', media: 16.8, nrDocentes: 2, ano2024s1: 20, ano2024s2: 30, ano2025s1: 40, ano2025s2: 45, ano2026s1: 50, ano2026s2: 45, ano2027s1: 48, ano2027s2: 50 }
      ]
    },

    {id: 100, codigo: 'ADM', nome: 'Administração', media: 9.12, nrDocentes: 130, ano2024s1: 140, ano2024s2: 100, ano2025s1: 100, ano2025s2: 130, ano2026s1: 100, ano2026s2: 120, ano2027s1: 130, ano2027s2: 130,
      subareas: [
        { id: 301,  codigo: 'MKT', nome: 'Marketing', media: 10.0, nrDocentes: 10, ano2024s1: 50, ano2024s2: 55, ano2025s1: 45, ano2025s2: 40, ano2026s1: 48, ano2026s2: 50, ano2027s1: 52, ano2027s2: 55 },
        { id: 302, codigo: 'DSG', nome: 'Design', media: 8.0, nrDocentes: 8, ano2024s1: 40, ano2024s2: 45, ano2025s1: 48, ano2025s2: 50, ano2026s1: 45, ano2026s2: 50, ano2027s1: 50, ano2027s2: 52 }
      ]
    },

    {id: 3, codigo: 'FIS', nome: 'Física', media: 6.12, nrDocentes: 130, ano2024s1: 105, ano2024s2: 100, ano2025s1: 100, ano2025s2: 130, ano2026s1: 100, ano2026s2: 120, ano2027s1: 130, ano2027s2: 130,
      subareas: [
        { id: 401, codigo: 'FISTEO',  nome: 'Física Teórica', media: 5.8, nrDocentes: 6, ano2024s1: 30, ano2024s2: 30, ano2025s1: 35, ano2025s2: 38, ano2026s1: 40, ano2026s2: 42, ano2027s1: 44, ano2027s2: 45 },
        { id: 402, codigo: 'FISEX', nome: 'Física Experimental', media: 6.5, nrDocentes: 7, ano2024s1: 40, ano2024s2: 35, ano2025s1: 45, ano2025s2: 48, ano2026s1: 50, ano2026s2: 50, ano2027s1: 52, ano2027s2: 53 }
      ]
    },

    {id: 12, codigo: 'QUI', nome: 'Química', media: 1.1, nrDocentes: 12, ano2024s1: 100, ano2024s2: 100, ano2025s1: 130, ano2025s2: 130, ano2026s1: 120, ano2026s2: 120, ano2027s1: 130, ano2027s2: 130,
      subareas: [
        { id: 501, codigo: 'QUIORG', nome: 'Química Orgânica', media: 1.9, nrDocentes: 4, ano2024s1: 30, ano2024s2: 25, ano2025s1: 32, ano2025s2: 30, ano2026s1: 35, ano2026s2: 33, ano2027s1: 37, ano2027s2: 40 },
        { id: 502,codigo: 'QUIINORG', nome: 'Química Inorgânica', media: 0.8, nrDocentes: 3, ano2024s1: 20, ano2024s2: 22, ano2025s1: 25, ano2025s2: 26, ano2026s1: 28, ano2026s2: 29, ano2027s1: 30, ano2027s2: 31 }
      ]
    },
    {id: 22, codigo: 'BIO', nome: 'Biologia', media: 1.5, nrDocentes: 14, ano2024s1: 120, ano2024s2: 115, ano2025s1: 130, ano2025s2: 129, ano2026s1: 138, ano2026s2: 140, ano2027s1: 145, ano2027s2: 150,
      subareas: [
        { id: 805, codigo: 'BIOCEL', nome: 'Biologia Celular', media: 1.1, nrDocentes: 5, ano2024s1: 40, ano2024s2: 38, ano2025s1: 42, ano2025s2: 44, ano2026s1: 47, ano2026s2: 50, ano2027s1: 52, ano2027s2: 55 },
        { id: 806, codigo: 'BIOEVO', nome: 'Evolução', media: 1.9, nrDocentes: 3, ano2024s1: 30, ano2024s2: 32, ano2025s1: 35, ano2025s2: 36, ano2026s1: 40, ano2026s2: 38, ano2027s1: 41, ano2027s2: 43 }
      ]
    },
    {id: 23, codigo: 'LET', nome: 'Letras', media: 0.9, nrDocentes: 11, ano2024s1: 85, ano2024s2: 88, ano2025s1: 90, ano2025s2: 92, ano2026s1: 95, ano2026s2: 98, ano2027s1: 100, ano2027s2: 103,
      subareas: [
        { id: 807, codigo: 'LETING', nome: 'Língua Inglesa', media: 0.7, nrDocentes: 4, ano2024s1: 28, ano2024s2: 29, ano2025s1: 30, ano2025s2: 32, ano2026s1: 33, ano2026s2: 34, ano2027s1: 36, ano2027s2: 37 },
        { id: 808, codigo: 'LETPOR', nome: 'Língua Portuguesa', media: 1.1, nrDocentes: 5, ano2024s1: 35, ano2024s2: 36, ano2025s1: 38, ano2025s2: 40, ano2026s1: 42, ano2026s2: 43, ano2027s1: 45, ano2027s2: 46 }
      ]
    },
    {id: 24, codigo: 'HIS', nome: 'História', media: 2.0, nrDocentes: 9, ano2024s1: 75, ano2024s2: 78, ano2025s1: 82, ano2025s2: 85, ano2026s1: 88, ano2026s2: 90, ano2027s1: 94, ano2027s2: 97,
      subareas: [
        { id: 809, codigo: 'HISANT', nome: 'História Antiga', media: 1.6, nrDocentes: 3, ano2024s1: 22, ano2024s2: 24, ano2025s1: 26, ano2025s2: 27, ano2026s1: 29, ano2026s2: 30, ano2027s1: 31, ano2027s2: 33 },
        { id: 810, codigo: 'HISMOD', nome: 'História Moderna', media: 2.4, nrDocentes: 2, ano2024s1: 18, ano2024s2: 19, ano2025s1: 21, ano2025s2: 23, ano2026s1: 25, ano2026s2: 26, ano2027s1: 27, ano2027s2: 28 }
      ]
    },
    {id: 26, codigo: 'DIR', nome: 'Direito', media: 0.9, nrDocentes: 9, ano2024s1: 75, ano2024s2: 78, ano2025s1: 82, ano2025s2: 85, ano2026s1: 88, ano2026s2: 90, ano2027s1: 94, ano2027s2: 97,
      subareas: [
        { id: 260, codigo: 'DIRE', nome: 'Direito', media: 1.6, nrDocentes: 3, ano2024s1: 22, ano2024s2: 24, ano2025s1: 26, ano2025s2: 27, ano2026s1: 29, ano2026s2: 30, ano2027s1: 31, ano2027s2: 33 },
      ]
    },
    {id: 27, codigo: 'SAÚ', nome: 'Saúde', media: 0.1, nrDocentes: 90, ano2024s1: 75, ano2024s2: 78, ano2025s1: 82, ano2025s2: 85, ano2026s1: 88, ano2026s2: 90, ano2027s1: 52, ano2027s2: 52,
      subareas: [
        { id: 271, codigo: 'ENMC', nome: 'Enfermagem Médico-Cirúrgica', media: 1.6, nrDocentes: 3, ano2024s1: 22, ano2024s2: 24, ano2025s1: 26, ano2025s2: 27, ano2026s1: 29, ano2026s2: 30, ano2027s1: 31, ano2027s2: 33 },
        { id: 272, codigo: 'ENSC', nome: 'Enfermagem em Saúde Coletiva', media: 1.6, nrDocentes: 3, ano2024s1: 22, ano2024s2: 24, ano2025s1: 26, ano2025s2: 27, ano2026s1: 29, ano2026s2: 30, ano2027s1: 31, ano2027s2: 33 },
        { id: 273, codigo: 'GERO', nome: 'Gerontologia', media: 1.6, nrDocentes: 3, ano2024s1: 22, ano2024s2: 24, ano2025s1: 26, ano2025s2: 27, ano2026s1: 29, ano2026s2: 30, ano2027s1: 31, ano2027s2: 33 },
        { id: 274, codigo: 'SABA', nome: 'Saúde Básica', media: 1.6, nrDocentes: 3, ano2024s1: 22, ano2024s2: 24, ano2025s1: 26, ano2025s2: 27, ano2026s1: 29, ano2026s2: 30, ano2027s1: 31, ano2027s2: 33 },
        { id: 275, codigo: 'FATC', nome: 'Farmacotécnica', media: 1.6, nrDocentes: 3, ano2024s1: 22, ano2024s2: 24, ano2025s1: 26, ano2025s2: 27, ano2026s1: 29, ano2026s2: 30, ano2027s1: 31, ano2027s2: 33 },
        { id: 276, codigo: 'FARM', nome: 'Farmácia', media: 1.6, nrDocentes: 3, ano2024s1: 22, ano2024s2: 24, ano2025s1: 26, ano2025s2: 27, ano2026s1: 29, ano2026s2: 30, ano2027s1: 31, ano2027s2: 33 },
      ]
    }



  ];

  get areasFiltradas() {
    const term = this.inputBusca.toLowerCase();
    return this.areas.filter(area =>
      area.nome.toLowerCase().includes(term) ||
      area.codigo.toLowerCase().includes(term)
    );
  }

}
