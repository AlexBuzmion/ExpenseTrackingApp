export interface SuggestedCategories {
    personalCategories: Record<string, string[]>;
    realEstateCategories: Record<string, string[]>;
    genericBusinessCategories: Record<string, string[]>;
  }
  
  export function getSuggestedCategories(): SuggestedCategories {
    const personalCategories: Record<string, string[]> = {
        "Housing": ["Rent", "Mortgage", "Maintenance", "Property Tax", "Home Insurance"],
        "Food & Groceries": ["Groceries", "Dining Out", "Snacks & Beverages", "Meal Delivery"],
        "Transportation": ["Fuel", "Public Transit", "Repairs", "Parking", "Car Insurance", "Car Loan Payments"],
        "Personal": ["Healthcare", "Entertainment", "Utilities", "Subscriptions", "Clothing", "Salon & Grooming"],
        "Bills & Utilities": ["Electricity", "Water", "Gas", "Internet", "Cell Phone"],
        "Insurance": ["Health Insurance", "Life Insurance", "Travel Insurance"],
        "Debt & Loans": ["Credit Card Payments", "Student Loan", "Personal Loan"],
        "Family & Friends": ["Childcare", "Gifts", "Donations", "Eldercare"],
        "Pet Care": ["Pet Food", "Vet Bills", "Grooming", "Boarding"],
        "Travel & Vacation": ["Flights", "Accommodation", "Rental Car", "Tours & Activities"],
        "Education": ["Tuition", "Books & Supplies", "Online Courses", "Professional Development"],
        "Miscellaneous": ["ATM Fees", "Late Fees", "Unplanned Expenses", "Hobbies", "Other"]
    };
  
    const realEstateCategories: Record<string, string[]> = {
        'Advertising and Marketing': [
            'Business Cards, Flyers, Brochures',
            'Photography & Videography',
            'Post Installation',
            'Printing Advertisements',
            'Property Staging',
            'Signage & Banners',
            'Social Meida Promotions',
            'Website Design, Maintenance',
        ], 
        'Bank and Financial Fees': [
            'Bank Fees for Business Accounts',
            'Credit Card processing fees',
            'Interest on Business Loans',
        ], 
        'Business Supplies and Equipment': [
            'Computer, Laptops, Tables & Accessories',
            'Mobile Phone & Phone Plans',
            'Software Subscriptions',
            'Stationery & Office Supplies',
        ],
        'Client Related Expenses': [
            'Client Gifts',
            'Meals & Entertainment',
            'Open House Expenses',
            'Status Certificate For Listings', 
        ],
        'Fees & Licenses': [
            'Licenses Renewal Costs',
            'Brokerage Fees',
            'MLS Subscriptions',
            'Real Estate Board Fees',
        ],
        'Home Office Expenses': [
            'Furniture and Equipment',
            'Home Insurance',
            'Internet',
            'Phone Cost',
        ],
        'Insurance': [
            'Business Liability Insurance',
            'Health & Disability Insurance',
            'RECO (Error & Omission) Insurance',
        ],
        'Miscellaneous': [
            'Courier and postage costs',
            'Personal protective equipment',
            'Small tools and supplies',
            'Donations',
        ],
        'Professional Development': [
            'Certification & Accreditations',
            'Professional Associations Memberships (CREA, OREA)',
            'Real Estate Course & Continuing Education',
            'Seminar, Conferences & Workshops',
        ],
        'Professional Services': [
            'Accountant or bookkeeper fees',
            'Consulting fees',
            'Legal fees for contracts or disputes',
        ],
        'Sales / Commission / Income': [
            'Commission Income',
            'CRA',
            'Revenue Share',
        ],
        'Travel Expenses': [
            'Hotel Accommodation',
            'Meal during business travel',
            'Transportation Cost for out of town work',
        ],
        'Vehicle Expenses': [
            'Car Insurance',
            'Gas/Fuel',
            'Parking Fees',
            'Licensing & Registration Fees',
            'Repair & Service Maintenance'
        ],
    };
  
    const genericBusinessCategories: Record<string, string[]> = {
        "Office Expenses": ["Rent", "Utilities", "Supplies", "Furniture"],
        "Marketing": ["Online Ads", "Print Ads", "Promotions", "Branding"],
        "Professional Services": ["Legal", "Accounting", "Consulting", "HR Services"],
        "Travel": ["Transportation", "Accommodation", "Meals", "Conferences"],
        "Insurance & Benefits": ["Health Insurance", "Business Liability", "Employee Benefits"],
        "Equipment & Maintenance": ["Hardware", "Software Licenses", "Repairs", "IT Support"],
        "Software & Subscriptions": ["Cloud Services", "Collaboration Tools", "Security Services"],
        "Taxes & Licenses": ["Business Taxes", "Permit Fees", "Annual Registrations"],
        "Payroll & Wages": ["Salaries", "Bonuses", "Overtime", "Payroll Taxes"]
    };
  
    return { personalCategories, realEstateCategories, genericBusinessCategories };
}
  