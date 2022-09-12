terraform {
  required_providers {
    okta = {
      source = "okta/okta"
      version = "~> 3.20"
    }
  }
}

# Configure the Okta Provider - API token set in env var.
provider "okta" {
  org_name  = var.org_name
  base_url  = var.base_url
  api_token = var.api_token
}

# ===================================================================
# Applications (Web and Native)
# ===================================================================
resource "okta_app_oauth" "student_native_app_ios_pkce" {
  label = "Student App - iOS PKCE"
  type = "native"
  consent_method = "REQUIRED"
  # login_uri = "https://localhost:5001/authorization-code/callback"
  logo_uri = "https://sam-studentapp-preprod-configmanagerstac-s3bucket-1md11alfbdv8k.s3.us-west-2.amazonaws.com/public/SlackIcon.png"
  post_logout_redirect_uris = [
    "com.okta.dev-6626298:/logout"
  ]
  redirect_uris = [
    "com.okta.dev-6626298:/callback"
  ]
  omit_secret = false
  grant_types = [
    "authorization_code",
    "refresh_token"
  ]
  token_endpoint_auth_method = "none" // For PKCE, set this to "none"
  response_types = [
    "code"
  ]
}

# Native App iOS
resource "okta_app_oauth" "student_native_app" {
  label = "Student App - Client Authn"
  type = "native"
  consent_method = "REQUIRED"
  login_uri = "https://localhost:5001/authorization-code/callback"
  logo_uri = "https://sam-studentapp-preprod-configmanagerstac-s3bucket-1md11alfbdv8k.s3.us-west-2.amazonaws.com/public/SlackIcon.png"
  post_logout_redirect_uris = [
    "https://demo.studentapp-preprod.rnp.io", 
    "https://demo.studentapp-preprod.rnp.io/login", 
    "https://robotsnpencils.postman.com/",
    "https://studentapp-api-preprod.rnp.io/"
  ]
  redirect_uris = ["https://localhost:5001/signin-oidc"]
  omit_secret = false
  grant_types = [
    "authorization_code",
    "implicit",
    "password",
    "urn:ietf:params:oauth:grant-type:token-exchange",
    "refresh_token"
  ]
  # token_endpoint_auth_method = "none" // For PKCE, set this to "none"
  response_types = [
    "code",
    "token",
    "id_token"
  ]
}

# Student Native App Android
resource "okta_app_oauth" "student_native_app_android_pkce" {
  label = "Student App - Android"
  type = "native"
  consent_method = "REQUIRED"
  # login_uri = "https://localhost:5001/authorization-code/callback"
  logo_uri = "https://sam-studentapp-preprod-configmanagerstac-s3bucket-1md11alfbdv8k.s3.us-west-2.amazonaws.com/public/SlackIcon.png"
  post_logout_redirect_uris = [
    "com.okta.dev-6626298:/logout"
  ]
  redirect_uris = [
    "com.okta.dev-6626298:/callback"
  ]
  omit_secret = false
  grant_types = [
    "authorization_code",
    "refresh_token"
  ]
  token_endpoint_auth_method = "none" // For PKCE, set this to "none"
  response_types = [
    "code"
  ]
}

# Student Native App Android
resource "okta_app_oauth" "student_native_app_android_pkce_maryville" {
  label = "Student App - Android (Maryville)"
  type = "native"
  consent_method = "REQUIRED"
  # login_uri = "https://localhost:5001/authorization-code/callback"
  logo_uri = "https://sam-studentapp-preprod-configmanagerstac-s3bucket-1md11alfbdv8k.s3.us-west-2.amazonaws.com/public/SlackIcon.png"
  post_logout_redirect_uris = [
    "com.okta.dev-6626298:/logout"
  ]
  redirect_uris = [
    "com.okta.dev-6626298:/callback"
  ]
  omit_secret = false
  grant_types = [
    "authorization_code",
    "refresh_token"
  ]
  token_endpoint_auth_method = "none" // For PKCE, set this to "none"
  response_types = [
    "code"
  ]
}

# ===================================================================
# Students User Group
# ===================================================================
resource "okta_group" "students" {
  name = "Student App - Students"
  description = "Students allowed access to the Student App"
}

# ===================================================================
# Assign Students User Group to Native and PKCE Apps
# ===================================================================
# Add Students to the ios PKCE
resource "okta_app_group_assignment" "students_student_ios_pkce" {
  app_id = okta_app_oauth.student_native_app_ios_pkce.id
  group_id = okta_group.students.id
}
# Add Students to the Native App
resource "okta_app_group_assignment" "students_student_native_app" {
  app_id = okta_app_oauth.student_native_app.id
  group_id = okta_group.students.id
}
# Add Students to the ios PKCE
resource "okta_app_group_assignment" "students_student_android_pkce" {
  app_id = okta_app_oauth.student_native_app_android_pkce.id
  group_id = okta_group.students.id
}
# Add Students to the Android PKCE - Maryville
resource "okta_app_group_assignment" "students_student_android_pkce_maryville" {
  app_id = okta_app_oauth.student_native_app_android_pkce_maryville.id
  group_id = okta_group.students.id
}



# ===================================================================
# Test Student Users
# ===================================================================
resource "okta_user" "student1" {
  first_name = "David"
  last_name = "Test-Okta"
  login = "studentappstest+rnp1@rnp.io"
  email = "studentappstest+rnp1@rnp.io"
  password_inline_hook = "default"
}
resource "okta_user" "student2" {
  first_name = "Lokesh"
  last_name = "Bhattarai-Okta"
  login = "studentappstest+rnp2@rnp.io"
  email = "studentappstest+rnp2@rnp.io"
  password_inline_hook = "default"
}
resource "okta_user" "student3" {
  first_name = "Empty"
  last_name = "Dumpty-Okta"
  login = "studentappstest+nodata@rnp.io"
  email = "studentappstest+nodata@rnp.io"
  password_inline_hook = "default"
}
resource "okta_user" "student4" {
  first_name = "Maria"
  last_name = "Garcia-Okta"
  login = "studentappstest+demo1@rnp.io"
  email = "studentappstest+demo1@rnp.io"
  password_inline_hook = "default"
}
resource "okta_user" "student5" {
  first_name = "Marko"
  last_name = "Lancaster-Okta"
  login = "studentappstest+demo2@rnp.io"
  email = "studentappstest+demo2@rnp.io"
  password_inline_hook = "default"
}

# ===================================================================
# Student Users to Student Group Membership
# ===================================================================
resource "okta_user_group_memberships" "student1_students_group_membership" {
  user_id = okta_user.student1.id
  groups = [
    okta_group.students.id
  ]
}
resource "okta_user_group_memberships" "student2_students_group_membership" {
  user_id = okta_user.student2.id
  groups = [
    okta_group.students.id
  ]
}
resource "okta_user_group_memberships" "student3_students_group_membership" {
  user_id = okta_user.student3.id
  groups = [
    okta_group.students.id
  ]
}
resource "okta_user_group_memberships" "student4_students_group_membership" {
  user_id = okta_user.student4.id
  groups = [
    okta_group.students.id
  ]
}
resource "okta_user_group_memberships" "student5_students_group_membership" {
  user_id = okta_user.student5.id
  groups = [
    okta_group.students.id
  ]
}

# ===================================================================
# Authorization Servers - to be used for API Access Mgmt
# ===================================================================

# DO NOT REMOVE - LOKESH IS USING THIS ONE
# DEPRECATED
resource "okta_auth_server" "student_api_auth_server" {
  name = "Student API Authorization Server (original)"
  description = "Custom Authorization Server for issuing/validating api access tokens"
  audiences = [
    "0oa407dos0XYElhNl5d7"
  ]
}

resource "okta_auth_server" "ios_pkce_auth_server" {
  name = "Student App - iOS PKCE Authorization Server"
  description = "Custom Authorization Server for issuing/validating tokens for iOS"
  audiences = [
    okta_app_oauth.student_native_app_ios_pkce.id
  ]
}

resource "okta_auth_server" "native_app_auth_server" {
  name = "Student API - Generic Authorization Server"
  description = "Custom Authorization Server for issuing/validating tokens for generic access"
  audiences = [
    okta_app_oauth.student_native_app.id
  ]
}

resource "okta_auth_server" "android_pkce_auth_server" {
  name = "Student App - Android PKCE Auth Server"
  description = "Custom Authorization Server for issuing/validating tokens for Android"
  audiences = [
    okta_app_oauth.student_native_app_android_pkce.id
  ]
}

resource "okta_auth_server" "android_pkce_auth_server_maryville" {
  name = "Student App - Android PKCE Auth Server (Maryville)"
  description = "Custom Authorization Server for issuing/validating tokens for Android"
  audiences = [
    okta_app_oauth.student_native_app_android_pkce_maryville.id
  ]
}


# Policies
# =========== DEPRECATED =============
resource "okta_auth_server_policy" "student_api_auth_server_policy" {
  auth_server_id   = okta_auth_server.student_api_auth_server.id
  status           = "ACTIVE"
  name             = "Student Auth Server API Policy (OG)"
  description      = "Default policy to apply for the Student API Auth Server"
  priority         = 1
  client_whitelist = [
    okta_app_oauth.student_native_app_ios_pkce.id,
    okta_app_oauth.student_native_app.id,
    okta_app_oauth.student_native_app_android_pkce.id
  ]
}

resource "okta_auth_server_policy" "ios_pkce_auth_server_policy" {
  auth_server_id   = okta_auth_server.ios_pkce_auth_server.id
  status           = "ACTIVE"
  name             = "iOS Policy"
  description      = "Default policy to apply for the Student API Auth Server"
  priority         = 1
  client_whitelist = [
    okta_app_oauth.student_native_app_ios_pkce.id,
    okta_app_oauth.student_native_app.id,
    okta_app_oauth.student_native_app_android_pkce.id
  ]
}

resource "okta_auth_server_policy" "native_app_auth_server_policy" {
  auth_server_id   = okta_auth_server.native_app_auth_server.id
  status           = "ACTIVE"
  name             = "Native Policy"
  description      = "Default policy to apply for the Student API Auth Server"
  priority         = 1
  client_whitelist = [
    okta_app_oauth.student_native_app_ios_pkce.id,
    okta_app_oauth.student_native_app.id,
    okta_app_oauth.student_native_app_android_pkce.id
  ]
}

resource "okta_auth_server_policy" "android_pkce_auth_server_policy" {
  auth_server_id   = okta_auth_server.android_pkce_auth_server.id
  status           = "ACTIVE"
  name             = "Student Auth Server - Android Policy"
  description      = "Default policy to apply for the Student API Auth Server"
  priority         = 1
  client_whitelist = [
    okta_app_oauth.student_native_app_android_pkce.id
  ]
}

resource "okta_auth_server_policy" "android_pkce_auth_server_policy_maryville" {
  auth_server_id   = okta_auth_server.android_pkce_auth_server_maryville.id
  status           = "ACTIVE"
  name             = "Student Auth Server - Android Policy (Maryville)"
  description      = "Default policy to apply for the Student API Auth Server"
  priority         = 1
  client_whitelist = [
    okta_app_oauth.student_native_app_android_pkce_maryville.id
  ]
}

# Rules
resource "okta_auth_server_policy_rule" "student_api_auth_server_policy_rule" {
  auth_server_id       = okta_auth_server.student_api_auth_server.id
  policy_id            = okta_auth_server_policy.student_api_auth_server_policy.id
  status               = "ACTIVE"
  name                 = "Students Groupd - Access to OG Auth Server"
  priority             = 1
  group_whitelist      = [
    okta_group.students.id
  ]
  grant_type_whitelist = [
    "implicit",
    "password",
    "authorization_code"
  ]
  scope_whitelist = [
    "*"
  ]
  access_token_lifetime_minutes = 600
}

resource "okta_auth_server_policy_rule" "ios_pkce_auth_server_policy_rule" {
  auth_server_id       = okta_auth_server.ios_pkce_auth_server.id
  policy_id            = okta_auth_server_policy.ios_pkce_auth_server_policy.id
  status               = "ACTIVE"
  name                 = "Students Group - Access to iOS"
  priority             = 1
  group_whitelist      = [
    okta_group.students.id
  ]
  grant_type_whitelist = [
    "implicit",
    "password",
    "authorization_code"
  ]
  scope_whitelist = [
    "*"
  ]
  access_token_lifetime_minutes = 600
}

resource "okta_auth_server_policy_rule" "native_app_auth_server_policy_rule" {
  auth_server_id       = okta_auth_server.native_app_auth_server.id
  policy_id            = okta_auth_server_policy.native_app_auth_server_policy.id
  status               = "ACTIVE"
  name                 = "Students Group - Access to Generic Native App"
  priority             = 1
  group_whitelist      = [
    okta_group.students.id
  ]
  grant_type_whitelist = [
    "implicit",
    "password",
    "authorization_code"
  ]
  scope_whitelist = [
    "*"
  ]
  access_token_lifetime_minutes = 600
}

resource "okta_auth_server_policy_rule" "android_pkce_auth_server_policy_rule" {
  auth_server_id       = okta_auth_server.android_pkce_auth_server.id
  policy_id            = okta_auth_server_policy.android_pkce_auth_server_policy.id
  status               = "ACTIVE"
  name                 = "Students Group - Access to Android"
  priority             = 1
  group_whitelist      = [
    okta_group.students.id
  ]
  grant_type_whitelist = [
    "implicit",
    "password",
    "authorization_code"
  ]
  scope_whitelist = [
    "*"
  ]
  access_token_lifetime_minutes = 600
}

resource "okta_auth_server_policy_rule" "android_pkce_auth_server_policy_rule_maryville" {
  auth_server_id       = okta_auth_server.android_pkce_auth_server_maryville.id
  policy_id            = okta_auth_server_policy.android_pkce_auth_server_policy_maryville.id
  status               = "ACTIVE"
  name                 = "Students Group - Access to Android (Maryville)"
  priority             = 1
  group_whitelist      = [
    okta_group.students.id
  ]
  grant_type_whitelist = [
    "implicit",
    "password",
    "authorization_code"
  ]
  scope_whitelist = [
    "*"
  ]
  access_token_lifetime_minutes = 600
}