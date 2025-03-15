# Dragoid

Dragoid CLI é uma ferramenta de linha de comando intuitiva e poderosa para baixar novels e capítulos para leitura offline. Com ele, você pode obter suas novels em formatos como HTML ou EPUB, ou fazer o download em JSON e utilizar o leitor web integrado da dragoid, oferecendo uma experiência de leitura prática diretamente no navegador.

## Requisitos

- Node.js v22.13.1 ou superior.

## Exemplos

Para baixar uma novel ou capítulo, use os seguintes comandos:

### Baixar novel
  ```bash
  dragoid download --mode=novel --url=<URL> --output-format=<JSON|HTML|EPUB>
  ```

### Baixar capítulo
  ```bash
  dragoid download --mode=chapter --url=<URL> --output-format=<JSON|HTML|EPUB>
  ```


### Leitor Web Integrado
Se a novel foi baixada no formato JSON, você pode visualizá-la no navegador:

  ```bash
  dragoid preview --file=<novel-file>
  ```

### Lista de sites suportados
Para visualizar os sites compatíveis, utilize:
 ```bash
 dragoid download --list-crawlers
 ```


## Formatos de downloads suportados

| Tipo | JSON | HTML | EPUB |
|------|------|------|------|
|Novel | ✅ | ❌ | ❌|
|Chapter| ✅ | ❌ | -|