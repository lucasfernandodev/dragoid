<img src="./docs/dragoid.webp" alt="Dragoid Logo by gpt" width="200" height="200" />

# Dragoid

O dragoid CLI é uma ferramenta de linha de comando para baixar novels e capítulos de sites suportados. Ele oferece opções para escolher o formato de saída e listar os sites e formatos suportados.

## Requisitos

- Node.js v22.13.1 ou superior.

## Usos

Para baixar uma novel ou capítulo, use os seguintes comandos:

- **Para baixar uma novel**:
  ```bash
  dragoid --mode=novel --url=<URL_DA_NOVEL> --output-format=<FORMATO>
  ```

- **Baixar um capítulo**:
  ```bash
  dragoid --mode=chapter --url=<URL_DA_NOVEL> --output-format=<FORMATO>
  ```

## Formatos de download suportados

- Novel
  - [x] JSON
  - [ ] HTML
  - [ ] EPUB
- Capítulo
  - [x] JSON
  - [ ] HTML

## Sites suportados
 Para ver a lista de sites suportados, use o comando:
 ```bash
 dragoid --list-crawlers
 ```