<template>
    <div class="w-[80%] my-20 flex items-center justify-center m-auto">
        <div>
            <div
                class="w-full font-bold uppercase text-xl mb-8 flex justify-center border-2 border-blue-500 rounded-xl p-5"
            >
                LinkedIn Github Badge Generator
            </div>
            <form @submit.prevent="generateSVG" class="grid grid-cols-2 gap-4 w-full">
                <div>
                    <div class="mb-[6px]">Name <span class="text-red-500">*</span></div>
                    <input
                        v-model="formOptions.name"
                        autocomplete="none"
                        type="text"
                        class="input-group"
                        placeholder="Mauricio Munoz"
                        required
                    />
                </div>
                <div>
                    <div class="mb-[6px]">Headline <span class="text-red-500">*</span></div>
                    <input
                        v-model="formOptions.headline"
                        autocomplete="none"
                        type="text"
                        class="input-group"
                        placeholder="Software Engineer"
                        required
                    />
                </div>
                <div>
                    <div class="mb-[6px]">Current Position <span class="text-red-500">*</span></div>
                    <input
                        v-model="formOptions.currentPosition"
                        autocomplete="none"
                        type="text"
                        class="input-group"
                        placeholder="Intern"
                        required
                    />
                </div>
                <div>
                    <div class="mb-[6px]">Education<span class="text-red-500">*</span></div>
                    <input
                        v-model="formOptions.education"
                        autocomplete="none"
                        type="text"
                        class="input-group"
                        placeholder="Bachelors Degree"
                        required
                    />
                </div>
                <div>
                    <div class="mb-[6px]">Profile Image URL<span class="text-red-500">*</span></div>
                    <input
                        v-model="formOptions.profileImageUrl"
                        autocomplete="none"
                        type="text"
                        class="input-group"
                        placeholder="https://media-exp1.licdn.com/dms/image/C4E03AQEwXutZ_HWnsQ/profile-displayphoto-shrink_800_800/0/1631334257269?e=1644451200&v=beta&t=jfTK-PELJ9AXBlhZ_ZodPs6God09gYe_7mAvsCPDvHo"
                        required
                    />
                </div>
                <div>
                    <div class="mb-[6px]">Theme<span class="text-red-500">*</span></div>
                    <div class="relative">
                        <select
                            v-model="formOptions.theme"
                            class="input-group appearance-none bg-white"
                            required
                        >
                            <option v-for="theme in themes" :value="theme">
                                {{ theme.replaceAll("_", " ") }}
                            </option>
                        </select>
                        <div
                            class="absolute h-full inset-y-0 right-0 flex items-center px-2 text-gray-700"
                        >
                            <svg
                                class="fill-current h-4 w-4"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
                                />
                            </svg>
                        </div>
                    </div>
                </div>
                <button
                    type="submit"
                    class="mt-4 col-span-2 p-4 bg-blue-500 text-white rounded-xl shadow-xl shadow-blue-500/20 cursor-pointer transition duration-500 hover:bg-blue-600"
                >
                    Generate Link!
                </button>
            </form>
            <div class="mt-8">
                <div class="mb-[6px]">Generated Link:</div>
                <input
                    class="p-4 bg-gray-100 text-gray-500 rounded-xl w-full border-2"
                    :class="{ 'border-red-500': isError }"
                    disabled
                    placeholder=""
                    v-model="link"
                />
                <div class="mt-4 flex items-center">
                    <button
                        :onclick="handleCopy"
                        class="py-2 px-4 shadow-xl shadow-blue-500/30 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition duration-500"
                    >
                        Copy
                    </button>
                    <div v-show="hasBeenCopied" class="ml-4 text-blue-500">Copied!</div>
                </div>
            </div>
            <div class="mt-8" v-show="svg != ''">
                <div class="mb-[6px]">Generated SVG:</div>
                <div class="w-[55%] h-full border-4 text-gray-500 rounded-xl p-4">
                    <img :src="'data:image/svg+xml;utf8,' + svg" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, Ref, ref } from "vue";
import axios from "axios";
import { RenderOptions } from "../../../types/render_types";
import { config } from "../../../config";

let formOptions: RenderOptions = {
    name: "",
    headline: "",
    currentPosition: "",
    education: "",
    theme: "light",
    profileImageUrl: "",
};

let link = ref("");
let hasBeenCopied = ref(false);
let isError = ref(false);
let svg = ref("");
let themes: Ref<string[]> = ref([]);

async function generateSVG() {
    // Encode URLs
    isError.value = false;
    const formParams = { ...formOptions };

    formParams.profileImageUrl = encodeURIComponent(formParams.profileImageUrl);

    // Send to server
    try {
        const URL = generateLink(formParams);
        const data = await axios.get(URL);
        svg.value = encodeURIComponent(data.data);
        link.value = URL.replaceAll(" ", "%20");
    } catch (error: any) {
        console.error(error);
        if (typeof error.message === "string") {
            link.value = error;
        }
        isError.value = true;
    }
}

function generateLink(formParams: RenderOptions) {
    return `${
        import.meta.env.PROD ? window.location : `http://${location.hostname}:${config.NODE_PORT}/`
    }api/render/${Object.values(formParams).join("/")}`;
}

function handleCopy() {
    window.navigator.clipboard.writeText(link.value).then(() => {
        hasBeenCopied.value = true;
        setTimeout(() => {
            hasBeenCopied.value = false;
        }, 2000);
    });
}

onMounted(async () => {
    try {
        const fetchedThemes = await axios.get(
            `${
                import.meta.env.PROD
                    ? window.location
                    : `http://${location.hostname}:${config.NODE_PORT}/`
            }api/getThemes`
        );
        themes.value = fetchedThemes.data;
    } catch (error) {
        console.error(error);
    }
});
</script>
