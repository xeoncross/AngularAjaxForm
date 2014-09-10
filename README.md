AngularAjaxForm
===============

Basic Angular.js attribute directive for HTML forms making them parse and display validation from the AJAX submit.

	<form role="form" method="post" action="/save/post" ajax-form>

		<div class="form-group">
			<label for="title">Title</label>
			<input type="text" class="form-control" name="title" placeholder="">
		</div>

		<div class="form-group">
			<label for="body" class="control-label">Body</label>
			<textarea class="form-control" name="body" rows="6"></textarea>
		</div>

		<input type="hidden" name="user_id" value="1234">

		<div class="form-group">
			<label for="type">Gender</label>
			<select class="form-control" name="gender">
				<option>M</option>
				<option>F</option>
			</select>
		</div>

		<button type="submit" class="btn btn-default">Save</button>
	</form>

Then it is expected that your "action" will return the following response:

	{
		validation : {
			title: "error message here...",
			body: "error message here...",
			etc...
		},
		...
	}

If your API returns a different validation error object then you need to create a method on your controller to process the validation and use that instead.

	<form ... ajax-form ajax-form-error="controllerMethodName">

You can also define the success callback instead of using the default (which simply resets the form).

	<form ... ajax-form ajax-form-success="controllerMethodName">

