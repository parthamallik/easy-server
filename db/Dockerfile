FROM library/postgres

# Set environment properties
ENV POSTGRES_USER admin
ENV POSTGRES_PASSWORD adminpass
ENV POSTGRES_DB ikigai

ADD init.sql /docker-entrypoint-initdb.d/
