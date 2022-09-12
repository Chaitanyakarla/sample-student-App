
CREATE TABLE IF NOT EXISTS public.organizations ( 
        id SERIAL PRIMARY KEY,
        code TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        description TEXT,
        crm_config JSONB,
        document_storage_config JSONB,
        options JSONB,
        created_on TIMESTAMP NOT NULL DEFAULT now(),
        modified_on TIMESTAMP
);
COMMENT ON TABLE public.organizations IS 'Organization-level metadata and config';


CREATE TABLE IF NOT EXISTS public.applications (
        id SERIAL PRIMARY KEY,
        organization_id BIGINT NOT NULL,
        apikey TEXT NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        identity_provider_config JSONB,
	native_app_config JSONB,
        created_on TIMESTAMP NOT NULL DEFAULT now(),
        modified_on TIMESTAMP,
        FOREIGN KEY (organization_id) REFERENCES public.organizations (id)
);
COMMENT ON TABLE applications IS 'Front end applications configured to be used at an organization';


-- TODO Rename to user_identity?
CREATE TABLE IF NOT EXISTS public.users (
        id SERIAL PRIMARY KEY,
        organization_id BIGINT NOT NULL,
        first_name TEXT,
        last_name TEXT,
        email TEXT,
        idp_identity JSONB,
        idp_sub TEXT,
        crm_principal_id TEXT,
        apikey_created_by TEXT,
        created_on TIMESTAMP NOT NULL DEFAULT now(),
        modified_on TIMESTAMP,
        FOREIGN KEY (organization_id) REFERENCES public.organizations (id)
);
COMMENT ON TABLE public.users IS 'Local storage of User Identity information obtained from third-party IdP';
