<script lang="ts">
	import { FileDropzone } from '@skeletonlabs/skeleton';
	let list_files: File[] = [];
	let selectedDays = 1;
	let isDestruct = true;
	// download link that will come from server
	let downloadLink: string | null = null;

	function onChangeHandler(e: Event): void {
		const input = e.target as HTMLInputElement;
		// adds the selected files to the list
		if (input.files) {
			list_files = [...list_files, ...Array.from(input.files)];
		}
		console.log('file data:', list_files);
	}

	// removes the file
	function removeFile(index: number): void {
		list_files = list_files.filter((_, i) => i !== index);
	}

	// uploads the selected files
	async function uploadFiles() {
		// Check if there are any files selected
		if (list_files.length === 0) {
			alert('Please select a file to upload.');
			return; // Exit the function if no files are selected
		}
		const formData = new FormData();
		list_files.forEach((file) => {
			formData.append('files', file);
		});
		formData.append('days', selectedDays.toString());
		formData.append('destruct', isDestruct.toString());

		console.log(formData);
		try {
			// server link
			const response = await fetch('http://localhost:3000/upload', {
				method: 'POST',
				body: formData
			});
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			// takes the data sent by server
			const data = await response.json();
			console.log('Upload successful:', data);
			downloadLink = data.links;
		} catch (error) {
			console.error('There was a problem with the fetch operation:', error);
		}
	}
	function closeAlert() {
		downloadLink = null;
	}
</script>

<div class="container mx-auto px-6 py-6 sm:px-16 lg:px-80">
	<div>
		<FileDropzone name="files" bind:list_files on:change={onChangeHandler}>
			<svelte:fragment slot="lead">
				<div class="flex justify-center items-center">
					<img src="/icons/system-solid-49-upload-file.gif" alt="Icon 1" class="w-20 h-15" />
				</div>
			</svelte:fragment>
			<svelte:fragment slot="message">Upload a file or drag and drop</svelte:fragment>
			<svelte:fragment slot="meta">max: 5mb</svelte:fragment>
		</FileDropzone>

		<ol>
			{#each list_files as file, index}
				<li>
					{file.name}
					<button on:click={() => removeFile(index)}>Remove</button>
				</li>
			{/each}
		</ol>
	</div>

	<div>
		<span>Storage Time</span>
		<select class="select" bind:value={selectedDays}>
			<option value="1">1 day</option>
			<option value="2">2 days</option>
			<option value="3">3 days</option>
			<option value="4">4 days</option>
			<option value="5">5 days</option>
		</select>
	</div>

	<div>
		<label class="flex items-center space-x-2">
			<input class="checkbox" type="checkbox" bind:checked={isDestruct} />
			<p>Destruct</p>
		</label>
	</div>

	<div>
		<button
			id="uploadButton"
			type="button"
			class="btn variant-filled-primary w-full"
			on:click={uploadFiles}
		>
			<span>Upload</span>
		</button>
	</div>

	{#if downloadLink}
		<aside class="alert fixed inset-0 flex items-center justify-center z-50">
			<div class="alert-message px-6 py-5 text-base rounded-lg shadow-lg variant-filled-surface">
				<h3 class="h3">Upload Successful</h3>
				<p>
					Your file has been uploaded successfully. Here is the link: <a
						href={downloadLink}
						class="text-blue-500 hover:underline">{downloadLink}</a
					>
				</p>
				<button type="button" class="btn variant-filled-error" on:click={closeAlert}>Close</button>
			</div>
		</aside>
	{/if}
</div>
