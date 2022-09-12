-- ============================
--        Organizations
-- ============================
INSERT INTO organizations (code, name, description, crm_config, document_storage_config, options)
VALUES ('rnpdev', 'Robots & Pencils University (the OG)', 'Dev/Test Institution',
'{
    "type": "salesforce",
    "domain": "https://studentapp-uat-dev-ed.my.salesforce.com",
    "authentication": {
        "uri": "https://login.salesforce.com/services/oauth2/token",
        "audience": "https://login.salesforce.com/",
        "grantType": "urn:ietf:params:oauth:grant-type:jwt-bearer",
        "jwtAlgorithm": "RS256",
        "username": "chris.hatton@studentapp.uat",
        "consumerKey": "3MVG9Nk1FpUrSQHccu4rAj1Nw6h.ManbDTHJQjdjj13xhvCR58CuG.SCW0fmEV0lpgyFlWGzMqiO_K.CYMZHz",
        "s3_privateKey": "salesforce-app-keys/rnpdev.key",
        "tokenExpiration": 21600
    }
}',
'{"foo": "bar"}',
'{
    "caching": {
        "enabled": true,
        "student_profile_expiration": 86400,
        "student_course_list_expiration": 43200,
        "student_task_expiration": 600,
        "student_success_contacts_expiration": 43200
    }
}');

INSERT INTO organizations (code, name, description, crm_config, document_storage_config, options)
VALUES ('maryville-preprod', 'Maryville - Preprod', 'First institution for Maryville setup',
'{
    "type": "salesforce",
    "domain": "https://studentapp-uat-dev-ed.my.salesforce.com",
    "authentication": {
        "uri": "https://login.salesforce.com/services/oauth2/token",
        "audience": "https://login.salesforce.com/",
        "grantType": "urn:ietf:params:oauth:grant-type:jwt-bearer",
        "jwtAlgorithm": "RS256",
        "username": "chris.hatton@studentapp.uat",
        "consumerKey": "3MVG9Nk1FpUrSQHccu4rAj1Nw6h.ManbDTHJQjdjj13xhvCR58CuG.SCW0fmEV0lpgyFlWGzMqiO_K.CYMZHz",
        "s3_privateKey": "salesforce-app-keys/rnpdev.key",
        "tokenExpiration": 21600
    }
}',
'{"foo": "bar"}',
'{
    "caching": {
        "enabled": true,
        "student_profile_expiration": 86400,
        "student_course_list_expiration": 43200,
        "student_task_expiration": 600,
        "student_success_contacts_expiration": 43200
    }
}');