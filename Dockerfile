# servidor web
FROM dhi.io/nginx:1.28-alpine3.22-dev as RUNNER

RUN rm -rf /etc/nginx/conf.d/* /usr/share/nginx/html/*

COPY nginx.conf /etc/nginx/conf.d/default.conf

# Origem: pasta gerada pelo CI | Destino: pasta baseada no BASE_HREF do Angular
COPY ./modulo-admin /usr/share/nginx/html/admin/
COPY ./modulo-dept-ensino /usr/share/nginx/html/dept-ensino/
COPY modulo-root /usr/share/nginx/html

HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1:8080/admin/ || exit 1

CMD ["nginx", "-g", "daemon off;"]