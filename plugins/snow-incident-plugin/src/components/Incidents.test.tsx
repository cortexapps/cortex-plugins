import { render } from "@testing-library/react";
import Incidents from "./Incidents";

const incJSON = {
  result: [
    {
      parent: "",
      made_sla: "true",
      caused_by: "",
      watch_list: "",
      upon_reject: "cancel",
      sys_updated_on: "2016-12-14 02:46:44",
      child_incidents: "0",
      hold_reason: "",
      origin_table: "",
      task_effective_number: "INC0000060",
      approval_history: "",
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
      user_input: "",
      sys_created_on: "2016-12-12 15:19:57",
      sys_domain: {
        link: "https://dev80317.service-now.com/api/now/table/sys_user_group/global",
        value: "global",
      },
      state: "7",
      route_reason: "",
      sys_created_by: "employee",
      knowledge: "false",
      order: "",
      calendar_stc: "102197",
      closed_at: "2016-12-14 02:46:44",
      cmdb_ci: {
        link: "https://dev80317.service-now.com/api/now/table/cmdb_ci/109562a3c611227500a7b7ff98cc0dc7",
        value: "109562a3c611227500a7b7ff98cc0dc7",
      },
      delivery_plan: "",
      contract: "",
      impact: "2",
      active: "false",
      work_notes_list: "",
      business_service: {
        link: "https://dev80317.service-now.com/api/now/table/cmdb_ci_service/27d32778c0a8000b00db970eeaa60f16",
        value: "27d32778c0a8000b00db970eeaa60f16",
      },
      business_impact: "",
      priority: "3",
      sys_domain_path: "/",
      rfc: "",
      time_worked: "",
      expected_start: "",
      opened_at: "2016-12-12 15:19:57",
      business_duration: "1970-01-01 08:00:00",
      group_list: "",
      work_end: "",
      caller_id: {
        link: "https://dev80317.service-now.com/api/now/table/sys_user/681ccaf9c0a8016400b98a06818d57c7",
        value: "681ccaf9c0a8016400b98a06818d57c7",
      },
      reopened_time: "",
      resolved_at: "2016-12-13 21:43:14",
      approval_set: "",
      subcategory: "email",
      work_notes: "",
      universal_request: "",
      short_description: "Unable to connect to email",
      close_code: "Solved (Permanently)",
      correlation_display: "",
      delivery_task: "",
      work_start: "",
      assignment_group: {
        link: "https://dev80317.service-now.com/api/now/table/sys_user_group/287ebd7da9fe198100f92cc8d1d2154e",
        value: "287ebd7da9fe198100f92cc8d1d2154e",
      },
      additional_assignee_list: "",
      business_stc: "28800",
      cause: "",
      description:
        "I am unable to connect to the email server. It appears to be down.",
      origin_id: "",
      calendar_duration: "1970-01-02 04:23:17",
      close_notes: "This incident is resolved.",
      notify: "1",
      service_offering: "",
      sys_class_name: "incident",
      closed_by: {
        link: "https://dev80317.service-now.com/api/now/table/sys_user/681ccaf9c0a8016400b98a06818d57c7",
        value: "681ccaf9c0a8016400b98a06818d57c7",
      },
      follow_up: "",
      parent_incident: "",
      sys_id: "1c741bd70b2322007518478d83673af3",
      contact_type: "self-service",
      reopened_by: "",
      incident_state: "7",
      urgency: "2",
      problem_id: "",
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
      comments: "",
      approval: "not requested",
      sla_due: "",
      comments_and_work_notes: "",
      due_date: "",
      sys_mod_count: "15",
      reopen_count: "0",
      sys_tags: "",
      escalation: "0",
      upon_approval: "proceed",
      correlation_id: "",
      location: "",
      category: "inquiry",
    },
  ],
};
const ciJSON = `{
  "result": [
    {
      "attested_date": "",
      "parent": "",
      "operational_status": "1",
      "consumer_type": "",
      "sys_updated_on": "2012-01-21 19:00:12",
      "number": "",
      "published_ref": "",
      "discovery_source": "",
      "first_discovered": "",
      "due_in": "",
      "used_for": "Production",
      "state": "",
      "gl_account": "",
      "invoice_number": "",
      "sys_created_by": "glide.maint",
      "warranty_expiration": "",
      "sla": "",
      "owned_by": {
        "link": "https://dev80317.service-now.com/api/now/table/sys_user/5f728212c0a8010e004a13c7588047dd",
        "value": "5f728212c0a8010e004a13c7588047dd"
      },
      "checked_out": "",
      "sys_domain_path": "/",
      "business_unit": "",
      "version": "",
      "maintenance_schedule": "",
      "cost_center": "",
      "attested_by": "",
      "dns_domain": "",
      "service_status": "",
      "assigned": "",
      "life_cycle_stage": "",
      "portfolio_status": "",
      "purchase_date": "",
      "business_need": "",
      "delivery_manager": "",
      "end_date": "",
      "short_description": "",
      "busines_criticality": "1 - most critical",
      "managed_by": {
        "link": "https://dev80317.service-now.com/api/now/table/sys_user/f298d2d2c611227b0106c6be7f154bc8",
        "value": "f298d2d2c611227b0106c6be7f154bc8"
      },
      "stakeholders": "",
      "can_print": "false",
      "last_discovered": "",
      "service_owner_delegate": "",
      "sys_class_name": "cmdb_ci_service",
      "manufacturer": "",
      "life_cycle_stage_status": "",
      "vendor": "",
      "model_number": "",
      "assigned_to": "",
      "start_date": "",
      "serial_number": "",
      "spm_taxonomy_node": "",
      "price_unit": "",
      "support_group": {
        "link": "https://dev80317.service-now.com/api/now/table/sys_user_group/8a4dde73c6112278017a6a4baf547aa7",
        "value": "8a4dde73c6112278017a6a4baf547aa7"
      },
      "correlation_id": "",
      "unverified": "false",
      "attributes": "",
      "asset": {
        "link": "https://dev80317.service-now.com/api/now/table/alm_asset/73c13e8837f3100044e0bfc8bcbe5d05",
        "value": "73c13e8837f3100044e0bfc8bcbe5d05"
      },
      "skip_sync": "false",
      "aliases": "",
      "attestation_score": "",
      "service_level_requirement": "",
      "sys_updated_by": "admin",
      "sys_created_on": "2008-10-22 23:19:20",
      "sys_domain": {
        "link": "https://dev80317.service-now.com/api/now/table/sys_user_group/global",
        "value": "global"
      },
      "install_date": "",
      "monitoring_requirements": "",
      "asset_tag": "",
      "user_group": "",
      "fqdn": "",
      "spm_service_portfolio": "",
      "change_control": {
        "link": "https://dev80317.service-now.com/api/now/table/sys_user_group/8a4dde73c6112278017a6a4baf547aa7",
        "value": "8a4dde73c6112278017a6a4baf547aa7"
      },
      "unit_description": "",
      "business_relation_manager": "",
      "last_review_date": "",
      "business_contact": "",
      "compatibility_dependencies": "",
      "delivery_date": "",
      "install_status": "1",
      "supported_by": "",
      "name": "SAP Enterprise Services",
      "subcategory": "",
      "price_model": "",
      "assignment_group": "",
      "managed_by_group": "",
      "prerequisites": "",
      "sys_id": "26da329f0a0a0bb400f69d8159bc753d",
      "po_number": "",
      "checked_in": "",
      "sys_class_path": "/!!/!7",
      "mac_address": "",
      "company": "",
      "justification": "",
      "department": "",
      "checkout": "",
      "comments": "",
      "cost": "",
      "attestation_status": "",
      "sys_mod_count": "9",
      "monitor": "false",
      "ip_address": "",
      "model_id": {
        "link": "https://dev80317.service-now.com/api/now/table/cmdb_model/e8aaeb3f3763100044e0bfc8bcbe5d20",
        "value": "e8aaeb3f3763100044e0bfc8bcbe5d20"
      },
      "duplicate_of": "",
      "sys_tags": "",
      "cost_cc": "USD",
      "order_date": "",
      "schedule": "",
      "environment": "",
      "due": "",
      "attested": "false",
      "location": "",
      "category": "",
      "fault_count": "0",
      "lease_id": "",
      "service_classification": ""
    }
  ]
}`;

const serviceYaml = `
openapi: 3.0.1
info:
  title: Retail Client Lookup
  x-cortex-tag: retail-client-lookup
  x-cortex-type: service
  x-cortex-groups:
  - plugin
`;

describe("Incidents", () => {
  beforeEach(() => {
    // if you have an existing `beforeEach` just add the following lines to it
    // fetchMock.mockIf(/^https?:\/\/api.getcortexapp.com*$/, req => {
    //     console.log("in block")
    //     return {
    //         body: JSON.stringify({}),
    //         headers: {
    //           'X-Some-Response-Header': 'Some header value'
    //         }
    //       }

    // })

    fetchMock.mockResponse(async (req) => {
      const targetUrl = req.url;
      if (targetUrl.startsWith("https://api.getcortexapp.com")) {
        return await Promise.resolve(JSON.stringify(serviceYaml));
      } else if (targetUrl.includes("api/now/table/incident?")) {
        return await Promise.resolve(JSON.stringify(incJSON));
      } else if (targetUrl.includes("/api/now/table/cmdb_ci_service")) {
        return await Promise.resolve(JSON.stringify(ciJSON));
      }
      throw new Error("Unexpected path");
    });
  });

  it("has Incidents", async () => {
    render(<Incidents />);
  });
});
