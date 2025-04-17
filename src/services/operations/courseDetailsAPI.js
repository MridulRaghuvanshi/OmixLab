export const fetchRelatedCourseLevels = async (courseName, educatorId, currentCourseId, token) => {
  try {
    const response = await apiConnector("POST", COURSE_RELATED_LEVELS_API, {
      courseName,
      educatorId,
      currentCourseId
    }, {
      Authorization: `Bearer ${token}`
    });

    if (!response?.data?.success) {
      throw new Error(response?.data?.message);
    }
    return response?.data?.data;
  } catch (error) {
    console.log("RELATED_COURSES_API ERROR", error);
    toast.error(error.message);
    return null;
  }
}; 