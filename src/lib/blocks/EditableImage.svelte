<script lang="ts">
	interface Props {
		src?: string;
		alt?: string;
		label: string;
		onUpload?: (src: string) => void;
	}

	let { src = '', alt = '', label, onUpload }: Props = $props();
	let previewUrl = $state<string | null>(null);
	let error = $state<string | null>(null);
	let busy = $state(false);
	const displaySrc = $derived(previewUrl ?? src);

	function clearPreview(): void {
		if (!previewUrl) return;
		URL.revokeObjectURL(previewUrl);
		previewUrl = null;
	}

	async function onFile(event: Event): Promise<void> {
		const input = event.currentTarget as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;
		error = null;
		clearPreview();
		previewUrl = URL.createObjectURL(file);
		busy = true;

		try {
			const { uploadDownscaledImageAsset } = await import('$lib/image-upload.js');
			const result = await uploadDownscaledImageAsset(file, 'static/uploads');
			onUpload?.(`/${result.path.replace(/^static\//, '')}`);
		} catch (cause) {
			clearPreview();
			error = cause instanceof Error ? cause.message : 'Upload failed.';
		} finally {
			busy = false;
			input.value = '';
		}
	}
</script>

{#if displaySrc}
	<img src={displaySrc} {alt} />
{/if}

{#if onUpload}
	<div class="block-image-editor">
		<label>
			<span>{displaySrc ? `Replace ${label}` : `Upload ${label}`}</span>
			<input type="file" accept="image/*" disabled={busy} onchange={onFile} />
		</label>
		{#if busy}<span role="status">Preparing image…</span>{/if}
		{#if error}<span role="alert">{error}</span>{/if}
	</div>
{/if}
