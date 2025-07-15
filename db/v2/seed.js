const axios = require("axios");
const ApplicationV2 = require("../../models/v2/Application.js");
const JobV2 = require("../../models/v2/Jobs.js");
const PropertyV2 = require("../../models/v2/Property.js");
const ContractorV2 = require("../../models/v2/Contractor.js");

const isValidDate = (dateString) => {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
};

const seedData = async () => {
  try {
    const jobresponse = await axios.get('https://data.cityofnewyork.us/resource/ic3t-wcy2.json');
    const contractorResponse = await axios.get('https://data.cityofnewyork.us/resource/t8hj-ruu2.json');

    const contractorData = contractorResponse.data ? contractorResponse.data : require("../contractors.json")
    const jobData = jobresponse.data ? jobresponse.data : require("../ic3t-wcy2.json")
    await JobV2.deleteMany({});
    await PropertyV2.deleteMany({});
    await ContractorV2.deleteMany({});
    await ApplicationV2.deleteMany({});


    // Adding Jobs and Properties into the database
    for (const item of jobData) {
      const job = {
        prefiling_date: isValidDate(item.pre__filing_date)
          ? new Date(item.pre__filing_date)
          : null,
        paid: isValidDate(item.paid) ? new Date(item.paid) : null,
        fully_permitted: isValidDate(item.fully_permitted)
          ? new Date(item.fully_permitted)
          : null,
        job_status: item.job_status,
        job_type: item.job_type,
       
        other_description: item.other_description,
        propertyID: item.property_id,
        Application_id: item.job__,
        job_number: item.job__,
        // Property_proptertyID: item.property_property_id,
        approved_date: isValidDate(item.approved)
          ? new Date(item.approved)
          : item.approved,
        approved: item.approved ? true : false,
        initial_cost: parseFloat(item.initial_cost.replace(/[^0-9.-]+/g, "")),
        total_est__fee: parseFloat(
          item.total_est__fee.replace(/[^0-9.-]+/g, "")
        ),
        job_status_descrp: item.job_status_descrp,
        city: item.city_,
        job_description: item.job_description ? item.job_description.replace(/\s{2,}/g, " ") : null,
        professional_cert: item.professional_cert,
        latest_action_date: isValidDate(item.latest_action_date)
          ? new Date(item.latest_action_date)
          : null,
        zip: item.zip,
        existing_occupancy: item.existing_occupancy,
        building_type: item.building_type,
        street_name: item.street_name.replace(/\s{2,}/g, " "),
        house_num: item.house__,
        owner_type: item.owner_type,
        borough: item.borough,
        non_profit: item.non_profit,
        property_owner_business_name: item.owner_s_business_name
          ? item.owner_s_business_name
          : null,
        property_owner_firstName: item.owner_s_first_name,
        property_owner_lastName: item.owner_s_last_name,
      };




    
    //if property exists using  street_name, property_owner_firstName, property_owner_lastName, house_num , update it, otherwise create a new one
      const existingProperty = await PropertyV2.findOne({
        property_owner_firstName: item.owner_s_first_name,
        property_owner_lastName: item.owner_s_last_name,
        property_owner_business_name: item.owner_s_business_name ? item.owner_s_business_name : null,
        street_name: item.street_name.replace(/\s{2,}/g, " "),
        house_num: item.house__,
      });
      if (existingProperty) {
        // existingProperty.job_listing.push(item.job__);
        const newProperty = await existingProperty.save();
        job.Property_proptertyID = newProperty._id;
        job.propertyID = newProperty._id;
      } else {
        const newProperty = await PropertyV2.create(job);
        job.Property_proptertyID = newProperty._id;
        job.propertyID = newProperty._id;
      }


      await JobV2.create(job);
    }


// Adding Contractors into the database
    const requiredFields = [
      "business_name",
      "business_house_number",
      "business_street_name",
      "license_business_city",
      "business_state",
      "business_zip_code",
      "business_phone_number",
      "license_status",
    ];

    for (const contractor of contractorData) {
      console.log(contractor);

      for (const key in contractor) {
        if (contractor[key] === undefined || contractor[key] === null) {
          contractor[key] = null;
        }
      }
      for (const field of requiredFields) {
        if (!(field in contractor)) {
          contractor[field] = null;
        } else {
          contractor[field] = contractor[field].toString().trim();
        }
        
      }
      await ContractorV2.create(contractor);
    }


    // Assigning contractors to jobs
    const allJobs = await JobV2.find();
    const allContractors = await ContractorV2.find();
    const properties = await PropertyV2.find();

    for (const job of allJobs) {
      // Randomly pick between 0 to 2 contractors
      const numContractors = Math.floor(Math.random() * 3); 
      const selectedContractors = [];

      for (let i = 0; i < numContractors; i++) {
        const randomIndex = Math.floor(Math.random() * allContractors.length);
        selectedContractors.push(allContractors[randomIndex].id);
      }
      job.contractors = selectedContractors;
      await job.save();
    }

// Adding Applications into the database
for (const application of jobData) {
        const app = {
            job_number: application.job__,
            applicant_firstName: application.applicant_s_first_name,
            applicant_lastName: application.applicant_s_last_name,
            applicant_title: application.applicant_professional_title,
            applicant_license: application.applicant_license__ ? application.applicant_license__ : null,
          };
        
        const existingApp = await ApplicationV2.findOne({
          applicant_license: app.applicant_license,
        });
        if (app.applicant_license === null){
            app.job_listing = [app.job_number];
            await ApplicationV2.create(app) 
        }
        else if (existingApp) {
          existingApp.job_listing.push(app.job_number);
          await existingApp.save();
        } else {
         app.job_listing = [app.job_number];
          await ApplicationV2.create(app);
        }
        }



    console.log("Data seeded successfully");
  } catch (error) {
    console.error("Error seeding data:", error);
  }

  // exit out of the process
  process.exit();
};

// Run the seed function
seedData();
