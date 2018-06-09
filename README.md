# WhoGrowsFoodFor.Us
Exploring the communities which grow food for us here in the United States.

@conroywhitney's entry to the [USDA Innovation Challenge 2015](https://usdaapps.devpost.com)

[View website &rarr; http://whogrowsfoodfor.us](http://whogrowsfoodfor.us)

## Goals
The aim of this project is to view the United States through the lens of
the regions that produce our food. This starts by looking at where food
is grown here in the United States.

To that end, this project has two key pieces of functionality:
 * To allow users to view which regions around the country are involved in the production
   of specific agricultural products (both crop- and animal-based), and to what degrees.
 * To allow users to view metadata about the distribution of
   agricultural production as a nation and within a given region.

The goal is to allow farmers, researches, and consumers to gain a better
understanding of our food system through the lens of a particular
agricultural product.

## Data
The data for this project is derived from the [National Agricultural Statistics Service (NASS) QuickStats API](http://quickstats.nass.usda.gov) as accessed through the [Microsoft Farm Data Dashboard](http://innovationchallenge.azurewebsites.net/#NassTab). 

### Data Disclaimer
The data used in this application is a filtered version of what is
available from the NASS QuickStats API. Specifically, products, query
options, and result values are omitted from the final dataset for
reasons of brevity (not all products need to be shown), simplicity
(conflating multiple variables such as areas planted vs. harvested), and
practicality (removing `(D)` values since they are too low to be
considered statistically valid).

For this reason, if you look closely, you will realize that not all of
the numbers add up. Specifically, the state numbers will not add up to
the national numbers, and the county numbers will not add up to the
state numbers. This is because the NASS QuickStats API omits values on
the county level which it includes in the state level, and omits some
state values that are counted in the national number. When in doubt,
click the `View in NASS QuickStats API` link in the application to view
the raw query which produced the data shown.

### Data Processing
The data used for this project can be downloaded in its original format.
Additionally, you can view the code used to transform from the public
format into the datasets in the `data` folder which is used by the
visualizations. Here are some steps to do that:

1. `npm run clean`: Start by cleaning all of the data that was packaged
   with this git repository.
2. Make any changes you want to the filters which will later remove
   certain products or options. These regular expressions can be found in the `productFilter` and `filterOption` methods of `src/product_helper.js`. Note the corresponding tests in `test/product_helper_spec.js` which will help explain how those functions are expected to behave.
3. `gulp product-list`: Download a list of all product names from
   the NASS API. Saves into `data/raw/product-list.json`.
4. `gulp product-metadata`: Download information about possible query string
   options for each product in the list (`class_desc`, `statisticcat_desc`, `unit_desc`, etc.). Saves into `data/raw/{product}/{option}.json`.
5. `gulp product-concat`: Combine all the separate raw option files into a single
   file which lists all possible option combinations. Saves into `data/raw/{product}/options.json`.
6. `gulp product-combinations`: Filter and create the [cartesian product](https://en.wikipedia.org/wiki/Cartesian_product) of all option combinations.
    These are then combined to create a `querystring` property which will be used to send a request to the [NASS QuickStats API](http://usdaapps.devpost.com/details/resources) per the contest rules. Creates a unique `name` property which is a human-readable summary of what the query represents (e.g., `lettuce_(romaine)_acres_area_harvested_county`). *Note: This step removes options which are not directly related to this application to reduce the number of query combinations.* Saves output to `data/raw/{product}/queries.json`.
7. `gulp product-jsonlint`: At this point, it's a good idea to
   sanity-check that all of the files we've been saving are indeed valid
JSON. This does not save or delete any files, just outputs any parser
errors it encounters. Ideally, there will be no output or effect. If you
see any errors, run `npm run clean` and start over.
8. `product-download`: Run each of the queries from step #6 by hitting
   the NASS QuickStats API with the `querystring`. Save the raw JSON
data directly to output file `data/raw/{product}/{query_name}.json`.
*Note: This method may fail based on timeouts from the API. For this
reason, you may need to loop between Step #8 and Step #9 a few times.*
9. `gulp product-jsonlint-clean`: Like Step #7, we run all existing
   files through `jsonlint` to find any formatting errors. However, this
time, we delete offending files so we can try re-downloading them again.
After running this step, return to Step #8 until you don't see any
output or errors in either Step #8 or Step #9. *Note: this may take a
handful of tries before it all downloads, but it will eventually
resolve and download everything.*
10. `product-clean`: Now that we have the API cached locally, filter and combine the raw query
   responses from Step #8 into smaller files which represent the
information we want to work with. Specifically, we need to know the
product name, class, and data values for National (FIPS 00000), State
(FIPS XX000), and County (FIPS XXYYY) levels. Look in the `getCleanJSON` method of `src/product_helper.js` to
see the transformation from raw API data to smaller JSON files. Check
out corresponding tests in `test/product_helper_spec.js` to see how the
function is expected to behave. Saves to `data/products/{product}.json`.
11. `product-combine-all`: Combine all product JSON files into one giant
   file to be included with the application. *Note: Some applications may just want a handful of
   product JSON files, or may choose to load them individually to save
time or bandwidth.* Saves to `data/products.json`.
12. `product-jsonlint`: One last time, sanity-check that all the files
    we have downloaded and transformed are indeed valid JSON objects.
This ensures that we can use any or all of these files in our
application without worring about causing any runtime parsing errors.

## Thank You!
This project would not be possible without the contributions, feedback,
and encouragement of the following people:

 * The open-source community, and @mbostock in particular, for [d3.js](https://github.com/mbostock/d3/) and a plethroa of examples and libraries which make projects like this possible. You da real MVP!
 * Stuart Allan of [Allan Cartography](http://allancartography.com/) for his explanations and feedback
   on how to make a map communicate what you are trying to say in the
simplest and most effective manner.
 * The [Dunbar Farms](http://dunbarfarms.com/) crew for their
   inspiration, encouragement, and knowledge base about investigating and participating in
the food production system here in the United States.
 * The [Zeal](https://codingzeal.com/) team for the co-working space,
   technical feedback, and encouragement.
 * Last but not least, Tanya Green, for her patience and feedback as I
   discussed this project ad nauseam for weeks.

