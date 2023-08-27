interface JsonApiResource {
  data: {
    type: string;
    attributes: Record<string, any>;
  };
}

export function formDataLikeJsonApi(formData: FormData, resourceType: string) {
  //convert formData
  const formDataObject: Record<string, any> = {};

  for (const [key, value] of formData.entries()) {
    formDataObject[key] = value;
  }

  //returns json
  return {
    data: {
      type: resourceType,
      attributes: formDataObject, //should be an object with key/value pair
    },
  } as JsonApiResource;
}
