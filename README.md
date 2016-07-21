# carto_doodle
Carto Doodle is a simple map geometry drawing and editing interface that uses CartoDB for data storage and visualization.  This is a very stripped-down app, developed to achieve a basic function - to allow users to draw and edit any number and type of map geometries.  I have not done any styling apart from what is minimally necessary.  I am sure that there are many places that the code can be improved, but I have tried to present it here in very basic units so that others may use it and customize it as they see fit.

Working demo:</br>
Drawing tool - http://field-set.com/carto_doodle/index.html</br>
Editing tool - http://field-set.com/carto_doodle/admin.html

<strong>Instructions</strong></p>
1. If you don't have a CartoDB account, go to https://cartodb.com and create one - you will not need anything more than the basic free account.</p>
2. Go to 'datasets' and create three new tables, calling them 'carto_doodle_point', 'carto_doodle_line', and 'carto_doodle_polygon'. Of course, you can actually call these tables anything you like, but this example is set up for these names.</p>
3. In each table, create a column called 'notes'. While you are in each table, also click on 'Edit' and change the privacy to 'With link'.</p>
4. In your CartoDB account tab, make note of your API key - you will need this for the PHP database connection files.</p>
5. In the carto_doodle_admin.js file, replace the three instances of 'YOUR_USERNAME_HERE' in the url_array variable with your CartoDB user name.</p>
6. In the two db_connection PHP files, set the $cartodb_username and $api_key variables to match your information.</p>
7. Upload these files to a directory called 'carto_doodle' on your webserver (you can't create, update, or delete data from a local development server, although you can read it) and you are good to go.</p>

<strong>A few other thoughts</strong>
<ul>
<li>This tool relies on the Leaflet Draw and CartoDB APIs. For more information on how to work with these and make Carto Doodle your own, check out https://github.com/Leaflet/Leaflet.draw and http://docs.cartodb.com/cartodb-platform/sql-api/</li>
<li>When creating note content, or editing/deleting geometries or notes in either mode, be aware that your changes must be saved in order to be submitted. I've added a save button to the note popups (in both drawing and editing modes), but map geometry changes and deletions must be saved by clicking the save tab that extends from the drawing tools after changes have been made.</li>
</ul></p>

<strong>Update - 5/16/16</strong>
The data insert/update/delete process has been greatly simplified. In the earlier version of Carto Doodle, every new, updated, and deleted map geometry was sent to CartoDB as a separate cURL; this updated version greatly simplifies that process. On submitting new map geometries, only one cURL is sent to each destination with one insert statement containing all of the new geometries to be inserted; similarly, from the admin page, there is one cURL per destination for updates and one cURL per destination for deletions.

<strong>Update - 7/21/16</strong>
See my repo 'GeoJSON Doodler' for a simplified (but probably more useful) tool that allows users to draw and export GeoJSONs to .csv