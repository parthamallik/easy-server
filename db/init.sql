
-- Create user table. Email is unique key as well.
CREATE TABLE public.users
(
    id serial NOT NULL,
    firstname text,
    lastname text,
    password text,
    email text unique,
    isverified boolean,
    createdat timestamp with time zone DEFAULT now(),
    modifiedat timestamp with time zone DEFAULT now(),
    CONSTRAINT users_pkey PRIMARY KEY (id)
) WITHOUT OIDS;

-- Email aaccount verificatin purpose, once email account verified then the data will be deleted by app automatically.
-- Stale data can be there, write the code to remove the stale data from this table.
CREATE TABLE public.user_verify
(
    id serial NOT NULL,
    userid integer,
    verifytoken text,
    CONSTRAINT user_verify_pkey PRIMARY KEY (id)
) WITHOUT OIDS;

CREATE TABLE public.tokens
(
    userid integer,
    secret text,
    issuedat timestamp with time zone DEFAULT now()
) WITHOUT OIDS;

CREATE TABLE public.pets
(
    id serial PRIMARY KEY,
    name text ,
    color text,
    quantity integer,
    type text,
    created_by integer,
    created_at timestamp with time zone DEFAULT now(),
    modified_at timestamp with time zone DEFAULT now(),
    modified_by integer
    -- timestamp default current_timestamp
) WITHOUT OIDS;

alter user admin with encrypted password 'adminpass';
GRANT ALL PRIVILEGES ON DATABASE ikigai TO admin;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO admin;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO admin;
