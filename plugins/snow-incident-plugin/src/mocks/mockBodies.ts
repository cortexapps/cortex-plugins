export const successMockBodies = {
  "https://api.cortex.dev/catalog/servicenow-plugin-config/openapi": {
    info: {
      "x-cortex-definition": {
        "servicenow-url": "https://unit-testing-snow-instance.service-now.com",
      },
    },
  },
  "https://api.cortex.dev/catalog/inventory-planner/openapi": {
    info: {
      title: "Inventory Planner",
      description: "it is a inventory planner",
      "x-cortex-tag": "inventory-planner",
      "x-cortex-type": "service",
    },
    openapi: "3.0.1",
    servers: [
      {
        url: "/",
      },
    ],
  },
  "https://unit-testing-snow-instance.service-now.com/api/now/table/cmdb_ci_service":
    {
      result: [
        {
          operational_status: "1",
          sys_updated_on: "2012-01-21 19:00:12",
          used_for: "Production",
          sys_created_by: "glide.maint",
          owned_by: {
            link: "https://dev80317.service-now.com/api/now/table/sys_user/5f728212c0a8010e004a13c7588047dd",
            value: "5f728212c0a8010e004a13c7588047dd",
          },
          sys_domain_path: "/",
          busines_criticality: "1 - most critical",
          managed_by: {
            link: "https://dev80317.service-now.com/api/now/table/sys_user/f298d2d2c611227b0106c6be7f154bc8",
            value: "f298d2d2c611227b0106c6be7f154bc8",
          },
          can_print: "false",
          sys_class_name: "cmdb_ci_service",
          support_group: {
            link: "https://dev80317.service-now.com/api/now/table/sys_user_group/8a4dde73c6112278017a6a4baf547aa7",
            value: "8a4dde73c6112278017a6a4baf547aa7",
          },
          unverified: "false",
          asset: {
            link: "https://dev80317.service-now.com/api/now/table/alm_asset/73c13e8837f3100044e0bfc8bcbe5d05",
            value: "73c13e8837f3100044e0bfc8bcbe5d05",
          },
          skip_sync: "false",
          sys_updated_by: "admin",
          sys_created_on: "2008-10-22 23:19:20",
          sys_domain: {
            link: "https://dev80317.service-now.com/api/now/table/sys_user_group/global",
            value: "global",
          },
          install_status: "1",
          name: "SAP Enterprise Services",
          sys_id: "26da329f0a0a0bb400f69d8159bc753d",
          sys_class_path: "/!!/!7",
          sys_mod_count: "9",
          monitor: "false",
          model_id: {
            link: "https://dev80317.service-now.com/api/now/table/cmdb_model/e8aaeb3f3763100044e0bfc8bcbe5d20",
            value: "e8aaeb3f3763100044e0bfc8bcbe5d20",
          },
          cost_cc: "USD",
          attested: "false",
          fault_count: "0",
        },
      ],
    },
  "https://unit-testing-snow-instance.service-now.com/api/now/table/incident": {
    result: [
      {
        made_sla: "true",
        sys_updated_on: "2016-12-14 02:46:44",
        task_effective_number: "INC0000060",
        number: "INC0000060",
        resolved_by: {
          link: "https://dev80317.service-now.com/api/now/table/sys_user/5137153cc611227c000bbd1bd8cd2007",
          value: "5137153cc611227c000bbd1bd8cd2007",
        },
        sys_updated_by: "employee",
        opened_by: {
          link: "https://dev80317.service-now.com/api/now/table/sys_user/681ccaf9c0a8016400b98a06818d57c7",
          value: "681ccaf9c0a8016400b98a06818d57c7",
        },
        sys_created_on: "2016-12-12 15:19:57",
        sys_domain: {
          link: "https://dev80317.service-now.com/api/now/table/sys_user_group/global",
          value: "global",
        },
        state: "7",
        sys_created_by: "employee",
        calendar_stc: "102197",
        closed_at: "2016-12-14 02:46:44",
        cmdb_ci: {
          link: "https://dev80317.service-now.com/api/now/table/cmdb_ci/109562a3c611227500a7b7ff98cc0dc7",
          value: "109562a3c611227500a7b7ff98cc0dc7",
        },
        impact: "2",
        active: "false",
        business_service: {
          link: "https://dev80317.service-now.com/api/now/table/cmdb_ci_service/27d32778c0a8000b00db970eeaa60f16",
          value: "27d32778c0a8000b00db970eeaa60f16",
        },
        priority: "3",
        sys_domain_path: "/",
        opened_at: "2016-12-12 15:19:57",
        business_duration: "1970-01-01 08:00:00",
        caller_id: {
          link: "https://dev80317.service-now.com/api/now/table/sys_user/681ccaf9c0a8016400b98a06818d57c7",
          value: "681ccaf9c0a8016400b98a06818d57c7",
        },
        resolved_at: "2016-12-13 21:43:14",
        subcategory: "email",
        short_description: "Unable to connect to email",
        close_code: "Solved (Permanently)",
        work_start: "",
        assignment_group: {
          link: "https://dev80317.service-now.com/api/now/table/sys_user_group/287ebd7da9fe198100f92cc8d1d2154e",
          value: "287ebd7da9fe198100f92cc8d1d2154e",
        },
        business_stc: "28800",
        description:
          "I am unable to connect to the email server. It appears to be down.",
        calendar_duration: "1970-01-02 04:23:17",
        close_notes: "This incident is resolved.",
        notify: "1",
        sys_class_name: "incident",
        closed_by: {
          link: "https://dev80317.service-now.com/api/now/table/sys_user/681ccaf9c0a8016400b98a06818d57c7",
          value: "681ccaf9c0a8016400b98a06818d57c7",
        },
        sys_id: "1c741bd70b2322007518478d83673af3",
        contact_type: "self-service",
        incident_state: "7",
        urgency: "2",
        company: {
          link: "https://dev80317.service-now.com/api/now/table/core_company/31bea3d53790200044e0bfc8bcbe5dec",
          value: "31bea3d53790200044e0bfc8bcbe5dec",
        },
        reassignment_count: "2",
        activity_due: "2016-12-13 01:26:36",
        assigned_to: {
          link: "https://dev80317.service-now.com/api/now/table/sys_user/5137153cc611227c000bbd1bd8cd2007",
          value: "5137153cc611227c000bbd1bd8cd2007",
        },
        severity: "3",
        approval: "not requested",
        sys_mod_count: "15",
        escalation: "0",
        upon_approval: "proceed",
        category: "inquiry",
      },
    ],
  },
};
