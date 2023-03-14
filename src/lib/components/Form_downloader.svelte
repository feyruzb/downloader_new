<script>
	// @ts-nocheck

	let url = '',
		formatSelect = '',
		resolutionOptions = '',
		error = false;

	function submit(event) {
		// event.preventDefault();
		error = !validator();
		validator() ? form.submit() : '';

        
	}

	function validator() {
		let status = url.includes('http') && ['MP3', 'MP4'].includes(formatSelect);
		if (formatSelect == 'MP4') status = status && resolutionOptions.includes('p');
		return status;
	}

	

</script>

<form id="form" class="w-50 m-auto">
	<div class="input-group mb-3 m-auto">
		<span class="input-group-text" id="inputGroup-sizing-default">URL</span>
		<input
			placeholder="URL HERE"
			bind:value={url}
			id="url"
			type="text"
			name="url"
			class="form-control"
			aria-label="Sizing example input"
			aria-describedby="inputGroup-sizing-default"
		/>
	</div>

	<div class="input-group mb-3 dropdownbar">
		<label class="input-group-text" for="inputGroupSelect02">Options</label>
		<select
			id="format"
			name="format"
			class={'form-select ' + (formatSelect != 'MP4' ? 'rounded-end ' : 'rounded-0 ')}
			bind:value={formatSelect}
		>
			<option selected disabled>Format</option>
			<option value="MP3">MP3</option>
			<option value="MP4">MP4</option>
		</select>
		<select
			id="resolution-options"
			class="form-select m-auto"
			aria-label=".form-select-sm example"
			name="resolution"
			style={'display:' + (formatSelect === 'MP4' ? 'block' : 'none')}
			bind:value={resolutionOptions}
		>
			<option selected disabled>Choose resolution</option>
			<option value="360p">360p</option>
			<option value="480p">480p</option>
			<option value="720p">720p</option>
		</select>
	</div>
	<div class="w-100 m-auto"> 
	<button id="download" class="btn btn-success m-auto d-block " on:click={submit}>Download</button>
	</div>
	<div id="alert" class="alert alert-danger" style={"display: " + (!error ? "none" : "block")} role="alert"> 
		A simple danger alert—check it out!
	</div>
</form>
