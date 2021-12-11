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
                    <div class="mb-[6px]">Current Position URL</div>
                    <input
                        v-model="formOptions.currentPositionUrl"
                        autocomplete="none"
                        type="text"
                        class="input-group"
                        placeholder="https://www.linkedin.com/company"
                    />
                </div>
                <div>
                    <div class="mb-[6px]">Education URL</div>
                    <input
                        v-model="formOptions.educationUrl"
                        autocomplete="none"
                        type="text"
                        class="input-group"
                        placeholder="https://www.linkedin.com/company"
                    />
                </div>
                <div>
                    <div class="mb-[6px]">
                        Linkedin Profile URL<span class="text-red-500">*</span>
                    </div>
                    <input
                        v-model="formOptions.linkedinProfileUrl"
                        autocomplete="none"
                        type="text"
                        class="input-group"
                        placeholder="https://www.linkedin.com/in/person"
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
            <div class="mt-8">
                <div class="mb-[6px]">Generated SVG:</div>
                <div class="w-[55%] h-full border-4 text-gray-500 rounded-xl p-4">
                    <img :src="'data:image/svg+xml;utf8,' + svg" />
                    <!-- <object :data="svg" type="image/svg+xml" id="mySVG"></object> -->
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import axios from "axios";
import { RenderOptions } from "../../../types/render_types";
import { config } from "../../../config";

let formOptions: RenderOptions = {
    name: "",
    headline: "",
    currentPosition: "",
    education: "",
    linkedinProfileUrl: "",
    profileImageUrl: "",
    currentPositionUrl: "",
    educationUrl: "",
};
let link = ref("");
let hasBeenCopied = ref(false);
let isError = ref(false);
let svg = ref("");

async function generateSVG() {
    // Encode URLs
    const formParams = { ...formOptions };

    formParams.currentPositionUrl = encodeURIComponent(formParams.currentPositionUrl);
    formParams.educationUrl = encodeURIComponent(formParams.educationUrl);
    formParams.linkedinProfileUrl = encodeURIComponent(formParams.linkedinProfileUrl);
    formParams.profileImageUrl = encodeURIComponent(formParams.profileImageUrl);

    console.log(formParams);
    // Send to server
    try {
        const URL = generateLink(formParams);
        const data = await axios.post(URL);
        svg.value = encodeURIComponent(data.data);
        link.value = URL;
    } catch (error: any) {
        console.error(error);
        if (typeof error.message === "string") {
            link.value = error;
        }
        isError.value = true;
    }
}

function generateLink(formParams: RenderOptions) {
    return `${config.BASE_URL}/api/render/${Object.values(formParams).join("/")}`;
}

function handleCopy() {
    window.navigator.clipboard.writeText(link.value).then(() => {
        hasBeenCopied.value = true;
        setTimeout(() => {
            hasBeenCopied.value = false;
        }, 2000);
    });
}
</script>
