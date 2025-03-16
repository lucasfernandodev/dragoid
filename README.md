# Dragoid

Uma ferramenta para baixar novels de fontes online e ler offline.

## Requisitos

- Node.js v22.13.1 ou superior.

## Instalação

```bash
npm install -g dragoid
```

## Exemplos

Para fazer o download de uma novel ou de um capítulo específico:

### Baixar novel
  ```bash
  dragoid download --mode=novel --url=<URL> --output-format=<JSON|HTML|EPUB>
  ```

### Baixar capítulo
  ```bash
  dragoid download --mode=chapter --url=<URL> --output-format=<JSON|HTML|EPUB>
  ```


### Leitor web integrado
O dragoid já vem com um leitor web integrado que permite a leitura de novels baixadas no formato JSON diretamente do navegador.

  ```bash
  dragoid preview --file=<NOVEL-FILE>
  ```

O servidor é iniciado na porta `3010`, acesse em: http://127.0.0.1:3010

### Listar sites suportados
Para visualizar as fontes suportadas, utilize
 ```bash
 dragoid download --list-crawlers
 ```


## Formatos de download suportados

| Tipo | JSON | HTML | EPUB |
|------|------|------|------|
|Novel | ✅ | ❌ | ❌|
|Capítulo| ✅ | ❌ | -|