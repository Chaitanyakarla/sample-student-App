-- ============================
-- Applications
-- ============================

-- For generating UUIDs as apikeys
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Default: SalesForce UAT & Auth0 (this key has been widely shared / used within dev)
INSERT INTO public.applications (organization_id, apikey, name, description, identity_provider_config, native_app_config)
VALUES (1, '8d79180x-378f-42ae-884e-f2d00ad44f54', 'OG Key/client:  Dev API KEY - UAT SF Org', 'Web application (Auth0) for UAT org', 
'{
        "type": "auth0",
        "crm_id_attribute": "email",
        "issuer": "https://dev-u9zozen7.us.auth0.com/",
        "audience": "https://studentapp-api-preprod.rnp.io",
        "client_id": "QiwVC4pY9VSBp5Z7MHWELTW8S13cDSHW",
        "use_cached_identity": true
}',
'{
  "deprecatedVersions": ["0.8", "0.9"],
  "supportedVersions": ["1.0", "1.1"],
  "upgradeUrl": "https://my.webapplication.com"
}'
);


-- Original Okta development
INSERT INTO public.applications (organization_id, apikey, name, description, identity_provider_config, native_app_config)
VALUES (1, 'de8f5ecb-2cdf-4c93-8853-edce11cb16cf', 'Default 2 (Okta): Dev API KEY - UAT SF Org', 'Test iOS application for federated identity to Okta',
'{
        "type": "okta",
        "crm_id_attribute": "email",
        "issuer": "https://dev-6626298.okta.com/oauth2/aus3eqad75XMPSc8a5d7",
        "audience": "https://studentapp-api-preprod.rnp.io",
        "client_id": "0oa34im8kq8XzRflZ5d7",
        "use_cached_identity": true
}',
'{
  "deprecatedVersions": ["0.8", "0.9"],
  "supportedVersions": ["1.0", "1.1"],
  "upgradeUrl": "https://original.okta.com"
}'
);

-- Android Auth0 Default
INSERT INTO public.applications (organization_id, apikey, name, description, identity_provider_config, native_app_config)
VALUES (1, 'd45f767a-04c5-4058-a5da-4a70edbfac3d', 'Android (Auth0): Dev API KEY - UAT SF Org', 'Default api key using legacy Auth0 for Android',
'{
        "type": "auth0",
        "crm_id_attribute": "email",
        "issuer": "https://dev-u9zozen7.us.auth0.com/",
        "audience": "https://studentapp-api-preprod.rnp.io",
        "client_id": "97rnoSjOyASUgtXAxMpqoBaB3wYoRySk",
        "use_cached_identity": true
}',
'{
  "deprecatedVersions": ["0.8", "0.9"],
  "supportedVersions": ["1.0", "1.1"],
  "upgradeUrl": "https://play.google.com"
}'
);

-- iOS Auth0 Default
INSERT INTO public.applications (organization_id, apikey, name, description, identity_provider_config, native_app_config)
VALUES (1, '8fd2236c-7f4f-4e21-9d2e-1653bad1327e', 'iOS (Auth0): Dev API KEY - UAT SF Org', 'Default api key for using legacy Auth0 for iOS',
'{
        "type": "auth0",
        "crm_id_attribute": "email",
        "issuer": "https://dev-u9zozen7.us.auth0.com/",
        "audience": "https://studentapp-api-preprod.rnp.io",
        "client_id": "97rnoSjOyASUgtXAxMpqoBaB3wYoRySk",
        "use_cached_identity": true
}',
'{
  "deprecatedVersions": ["0.8", "0.9"],
  "supportedVersions": ["1.0", "1.1"],
  "upgradeUrl": "https://apple.com"
}'
);


-- Slack
INSERT INTO public.applications (organization_id, apikey, name, description, identity_provider_config, native_app_config)
VALUES (1, '3d376a8d-5d73-42c6-8ee1-8a89ba6d4005', 'Slack (Auth0) - Dev API KEY - UAT SF Org', 'Default api key for using legacy Auth0 for Slack',
'{
        "type": "auth0",
        "crm_id_attribute": "email",
        "issuer": "https://dev-u9zozen7.us.auth0.com/",
        "audience": "https://studentapp-api-preprod.rnp.io",
        "client_id": "Bq4cbCmAWGCUBhU10AkEi7JNPlTiugJs",
        "use_cached_identity": true
}',
'{
  "deprecatedVersions": ["0.8", "0.9"],
  "supportedVersions": ["1.0", "1.1"],
  "upgradeUrl": "https://slack.com"
}'
);

-- Lokesh' test Maryville appllication
INSERT INTO public.applications (organization_id, apikey, name, description, identity_provider_config, native_app_config)
VALUES (1, 'ced5b05c-2f60-47d1-91b9-135810db90b3', 'Default 3 - Lokesh (Auth0): Dev API KEY - UAT SF Org', 'API key to allow Lokesh to have 2 different FE Android apps for branding for Maryville',
'{
        "type": "auth0",
        "crm_id_attribute": "email",
        "issuer": "https://dev-u9zozen7.us.auth0.com/",
        "audience": "https://studentapp-api-preprod.rnp.io",
        "client_id": "tuuFbqElWZMk7sXfG9GgTXBRiZzKPbmB",
        "use_cached_identity": true
}',
'{
  "deprecatedVersions": ["0.8", "0.9"],
  "supportedVersions": ["1.0", "1.1"],
  "upgradeUrl": "https://maryville.play.google.com"
}'
);

INSERT INTO public.applications (organization_id, apikey, name, description, identity_provider_config, native_app_config)
VALUES (1, '565c02a4-d27d-44ee-9843-d10aaca8fd67', 'Native (Okta) PKCE: Dev API KEY - UAT SF Org', 'First Native PKCE Okta integration - iOS',
'{
        "type": "okta",
        "crm_id_attribute": "email",
        "issuer": "https://dev-6626298.okta.com/oauth2/aus3eqad75XMPSc8a5d7",
        "audience": "0oa40bjai41ZigLHF5d7",
        "client_id": "0oa40bjai41ZigLHF5d7",
        "use_cached_identity": true
}',
'{
  "deprecatedVersions": ["0.8", "0.9"],
  "supportedVersions": ["1.0", "1.1"],
  "upgradeUrl": "https://example.com"
}'
);
      
INSERT INTO public.applications (organization_id, apikey, name, description, identity_provider_config, native_app_config)
VALUES (1, 'de6f3dc0-b1bc-47aa-8c7b-f06e7cbff3bf', 'Android (Okta) PKCE: Dev API KEY - UAT SF Org', 'First Native PKCE Okta integration - Android',
'{
        "type": "okta",
        "crm_id_attribute": "email",
        "issuer": "https://dev-6626298.okta.com/oauth2/aus40z0681GvBWpOr5d7",
        "client_id": "0oa40z1lmrX3ri9py5d7",
        "audience": "0oa40z1lmrX3ri9py5d7",
        "use_cached_identity": true
}',
'{
  "deprecatedVersions": ["0.8", "0.9"],
  "supportedVersions": ["1.0", "1.1"],
  "upgradeUrl": "https://example.com"
}'
);
   
INSERT INTO public.applications (organization_id, apikey, name, description, identity_provider_config, native_app_config)
VALUES (1, 'a8c3718a-f08e-42a4-a40a-cc07f267f5f6', 'iOS (Okta) PKCE: Dev API KEY - UAT SF Org', 'First Native PKCE Okta integration - iOS',
'{
        "type": "okta",
        "crm_id_attribute": "email",
        "issuer": "https://dev-6626298.okta.com/oauth2/aus40z0gr8WuL80Qf5d7",
        "client_id": "0oa40yzjs2jaCBGgn5d7",
        "audience": "0oa40yzjs2jaCBGgn5d7",
        "use_cached_identity": true
}',
'{
  "deprecatedVersions": ["0.8", "0.9"],
  "supportedVersions": ["1.0", "1.1"],
  "upgradeUrl": "https://example.com"
}'
);
   
INSERT INTO public.applications (organization_id, apikey, name, description, identity_provider_config, native_app_config)
VALUES (2, 'eed9aafa-b92b-4536-91c0-229caa49382a', 'Android (Okta) PKCE: Dev API KEY - Maryville UAT', 'Android (Okta) - Maryville Preprod',
'{
        "type": "okta",
        "crm_id_attribute": "email",
        "issuer": "https://dev-6626298.okta.com/oauth2/aus4fx92nyKGCC0gZ5d7",
        "client_id": "0oa4fx4j8r1IiYmJL5d7",
        "audience": "0oa4fx4j8r1IiYmJL5d7",
        "use_cached_identity": true
}',
'{
  "deprecatedVersions": ["0.8", "0.9"],
  "supportedVersions": ["1.0", "1.1"],
  "upgradeUrl": "https://example.com"
}'
);

-- INSERT INTO public.applications (organization_id, apikey, name, description, identity_provider_config, native_app_config)
-- VALUES (1, (SELECT uuid_generate_v4()::text), 'Android Demo App - Okta (Org 1)', 'Test Android application for federated identity to Okta',
-- '{
--         "type": "okta",
--         "crm_id_attribute": "email",
--         "issuer": "https://dev-6626298.okta.com/oauth2/aus3eqad75XMPSc8a5d7",
--         "audience": "https://studentapp-api-preprod.rnp.io",
--         "client_id": "0oa34im8kq8XzRflZ5d7"
-- }',
-- '{
--   "deprecatedVersions": ["0.8", "0.9"],
--   "supportedVersions": ["1.0", "1.1"],
--   "upgradeUrl": "https://example.com"
-- }'
-- );

