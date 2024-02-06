<script lang="ts">
	import { goto } from '$app/navigation';
	import Icon from '@iconify/svelte';
	import SelectFile from '@lib/components/SelectFile.svelte';
	import SimpleFileGrid from '@lib/components/SimpleFileGrid.svelte';
	import UserPillList from '@lib/components/UserPillList.svelte';
	import UserSearchBar from '@lib/components/UserSearchBar.svelte';
	import FilledButton from '@lib/components/buttons/FilledButton.svelte';
	import FilledRouteButton from '@lib/components/buttons/FilledRouteButton.svelte';
	import OutlinedButton from '@lib/components/buttons/OutlinedButton.svelte';
	import { publishSignRequest } from '@lib/nostr/publishSignRequest';
	import { fetchUserFiles, type FileMetadataEvent } from '@lib/nostr/subToUserFiles';
	import type { NDKUser } from '@nostr-dev-kit/ndk';
	import { onMount } from 'svelte';
	import toast from 'svelte-french-toast';

	let selectedUsers = new Set<NDKUser>();
	let selectedFiles = new Set<FileMetadataEvent>();

	let steps = [
		{ step: 'Files', icon: 'solar:folder-with-files-bold-duotone' },
		{ step: 'Signers', icon: 'solar:folder-with-files-bold-duotone' },
		{ step: 'Review', icon: 'solar:folder-with-files-bold-duotone' },
		{ step: 'Finish', icon: 'solar:check-circle-bold-duotone' }
	];
	let activeStep = 0;
	let nextButtonDisabled = false;
	let loading = false;

	$: nextButtonText = activeStep === steps.length - 2 ? 'Submit' : 'Next';
	$: nextButtonIcon =
		activeStep === steps.length - 2
			? 'solar:check-square-line-duotone'
			: 'solar:arrow-right-line-duotone';
	$: if (activeStep === 0) {
		nextButtonDisabled = selectedFiles.size === 0;
	}
	$: if (activeStep === 1) {
		nextButtonDisabled = selectedUsers.size === 0;
	}

	onMount(async () => {
		await fetchUserFiles();
	});

	const onNextClick = () => {
		if (activeStep === steps.length - 2) {
			return onSubmit();
		}

		activeStep += 1;
	};

	const onSubmit = async () => {
		loading = true;

		const fileMetadataEventId = Array.from(selectedFiles).map((e) => e.id)[0];
		const signerPubkeys = Array.from(selectedUsers).map((u) => u.pubkey);

		toast
			.promise(publishSignRequest(fileMetadataEventId, signerPubkeys), {
				loading: 'Submitting...',
				success: 'Submitted!',
				error: 'Could not submit.'
			})
			.finally(() => {
				loading = false;
				activeStep = steps.length - 1;
			});
	};

	const onFinishClick = () => {
		selectedFiles.clear();
		selectedUsers.clear();
		activeStep = 0;
		goto('/');
	};
</script>

<div class="w-full flex flex-col items-center">
	<div class="w-full md:max-w-screen-md flex flex-col bg-gray-100 p-4 rounded-3xl">
		<div class="w-full flex items-center gap-4 text-gray-400">
			{#each steps as step, i}
				<div
					class="flex gap-2 items-center"
					class:text-gray-600={activeStep === i}
					class:text-primary-500={activeStep > i}
				>
					<Icon icon={step.icon} width="16" height="16" />
					<p>{step.step}</p>
				</div>
				{#if i < steps.length - 1}
					<div
						class="h-1 grow bg-gray-300 rounded-3xl"
						class:!bg-primary-500={activeStep > i}
					></div>
				{/if}
			{/each}
		</div>

		<!-- step items -->
		<div class="w-full my-8">
			{#if activeStep === 0}
				<div class="my-1 flex flex-col gap-2">
					<p class="my-2 text-xl font-bold">Select files to be signed</p>
					<SelectFile bind:selectedFiles />
				</div>
			{:else if activeStep === 1}
				<div class="my-1">
					<p class="my-2 text-xl font-bold">Select users to ask for signature</p>
					<UserSearchBar showSelectedUsers bind:selectedUsers />
				</div>
			{:else if activeStep === 2}
				<div class="my-1">
					<p class="my-2 text-xl font-bold">Review your signature request</p>
					<div class="pb-2 border-b border-gray-200">
						<p class="my-2 text-md text-gray-500">File(s) to be signed</p>
						<SimpleFileGrid files={Array.from(selectedFiles)} />
					</div>
				</div>
				<div class="pb-2 border-b border-gray-200">
					<p class="my-2 text-md text-gray-500">Users that will be asked to sign</p>
					<UserPillList users={Array.from(selectedUsers)} />
				</div>
			{:else if activeStep === 3}
				<div class="w-full pb-2 flex flex-col justify-center items-center gap-2 border-gray-200">
					<Icon
						icon="solar:check-circle-bold-duotone"
						width="96"
						height="96"
						class="text-green-500"
					/>
					<p class="font-bold text-xl">Your request has been submitted</p>
					<FilledButton on:click={onFinishClick}>Go to requests</FilledButton>
				</div>
			{/if}
		</div>

		<!-- step controls -->
		{#if activeStep < steps.length - 1}
			<div class="w-full flex gap-2 justify-end">
				{#if activeStep > 0}
					<OutlinedButton
						on:click={() => {
							activeStep -= 1;
						}}
					>
						<div class="flex gap-2">
							<Icon icon="solar:arrow-left-line-duotone" width="24" height="24" />
							<p>Back</p>
						</div>
					</OutlinedButton>
				{/if}
				<FilledButton on:click={() => onNextClick()} disabled={nextButtonDisabled}>
					<div class="flex gap-2">
						<p>{nextButtonText}</p>
						<Icon icon={nextButtonIcon} width="24" height="24" />
					</div>
				</FilledButton>
			</div>
		{/if}
	</div>
</div>
