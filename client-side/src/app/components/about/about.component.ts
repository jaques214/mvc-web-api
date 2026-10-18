import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  template: `<section class="container">
    <p>
      Atualmente, devido à pandemia provocada pelo
      <a
        href="https://www.sns24.gov.pt/tema/doencas-infecciosas/covid-19/"
        target="_blank"
        >Sars-Cov-2</a
      >, a realização de eventos culturais está significativamente condicionada
      pelos requisitos impostos pela
      <a href="https://www.dgs.pt/" target="_blank">Direção-Geral de Saúde</a>.
      Os promotores de eventos culturais deparam-se com grandes problemas
      logísticos associados à restrições necessárias como, por exemplo, redução
      da lotação dos espaços de espetáculo, obrigatoriedade de testes aos
      expectadores, devolução de bilhetes e cancelamento de espetáculos. Tendo
      estas condicionantes em mente, esta plataforma web serve para ajudar os
      promotores de eventos culturais a gerir este novo fluxo de trabalho.
    </p>
  </section>`,
  styles: `
    .container {
      padding: 35px 0;
      max-width: 1280px;
      margin: auto;
      line-height: 1.5rem;
    }

    .container a {
      text-decoration: none;
      color: #3f51b5;
      font-weight: bolder;
    }

    p {
      color: #fff;
      text-align: justify;
    }
  `,
})
export class AboutComponent {}
