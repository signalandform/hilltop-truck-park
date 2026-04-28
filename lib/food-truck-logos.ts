/** Default logo URLs sourced from hilltoptruckpark.com resident trucks (Wix CDN). Used when CMS has no image. */
const FALLBACK_BY_NORMALIZED_NAME: Record<string, string> = {
  "indian creek bbq":
    "https://static.wixstatic.com/media/51d5cc_1f05669c2fe94dc9a157211787f8c0d7~mv2.jpg/v1/fit/w_480,h_479,q_90,enc_avif,quality_auto/51d5cc_1f05669c2fe94dc9a157211787f8c0d7~mv2.jpg",
  "gogi time korean bbq":
    "https://static.wixstatic.com/media/cdd0d9_cfa6cdd370cc4a46ae4fe6f77182d055~mv2.jpg/v1/fill/w_480,h_479,fp_0.5_0.42,q_90,enc_avif,quality_auto/cdd0d9_cfa6cdd370cc4a46ae4fe6f77182d055~mv2.jpg",
  "el villa mexican food":
    "https://static.wixstatic.com/media/cdd0d9_0d08f05fa3594331b0acb0229a7a4d51~mv2.jpg/v1/fit/w_480,h_479,q_90,enc_avif,quality_auto/cdd0d9_0d08f05fa3594331b0acb0229a7a4d51~mv2.jpg",
  "fryer and ice":
    "https://static.wixstatic.com/media/cdd0d9_090b88b56f9a4bd7b2b512d6065808e1~mv2.jpg/v1/fit/w_480,h_480,q_90,enc_avif,quality_auto/cdd0d9_090b88b56f9a4bd7b2b512d6065808e1~mv2.jpg",
  "sauce'd":
    "https://static.wixstatic.com/media/51d5cc_74d500c9cd354281ae3e71fe92b739f5~mv2.jpg/v1/fit/w_480,h_479,q_90,enc_avif,quality_auto/51d5cc_74d500c9cd354281ae3e71fe92b739f5~mv2.jpg",
  "street spice halal cuisine":
    "https://static.wixstatic.com/media/cdd0d9_e1a33504facd40f3952921ffa82e2a9a~mv2.jpg/v1/fit/w_480,h_479,q_90,enc_avif,quality_auto/cdd0d9_e1a33504facd40f3952921ffa82e2a9a~mv2.jpg",
  "baja quesadilla":
    "https://static.wixstatic.com/media/51d5cc_31dcc53880334396827d2367b02fc6f9~mv2.jpg/v1/fit/w_480,h_479,q_90,enc_avif,quality_auto/51d5cc_31dcc53880334396827d2367b02fc6f9~mv2.jpg",
  "t mac's cajun pot seafood":
    "https://static.wixstatic.com/media/51d5cc_230a439f956e4590a2c9bf84c8ad5bc5~mv2.jpeg/v1/fit/w_480,h_480,q_90,enc_avif,quality_auto/51d5cc_230a439f956e4590a2c9bf84c8ad5bc5~mv2.jpeg",
  "chow gluten free truck":
    "https://static.wixstatic.com/media/51d5cc_984772f703b248f189d308b9f3a28821~mv2.jpg/v1/fit/w_480,h_479,q_90,enc_avif,quality_auto/51d5cc_984772f703b248f189d308b9f3a28821~mv2.jpg",
  "chixn wangz":
    "https://static.wixstatic.com/media/51d5cc_f1233f4a75e341a2908e2a7d1032037c~mv2.jpg/v1/fit/w_480,h_479,q_90,enc_avif,quality_auto/51d5cc_f1233f4a75e341a2908e2a7d1032037c~mv2.jpg",
};

function normalizeFoodTruckName(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, " ");
}

export function resolveFoodTruckImageUrl(truck: {
  name: string;
  image_url: string | null;
}): string | null {
  const fromCms = truck.image_url?.trim();
  if (fromCms) return fromCms;
  const key = normalizeFoodTruckName(truck.name);
  return FALLBACK_BY_NORMALIZED_NAME[key] ?? null;
}

/** Wix-hosted logos read best with padding; CMS uploads often work better as cover. */
export function foodTruckImageIsLogoAsset(url: string): boolean {
  return url.includes("wixstatic.com");
}
