/**
 * Get the name of the project.
 *
 * @returns {Promise<Response>}
 */
export const getProjectName = () => {
    return fetch('http://localhost:8001/flowsheets/project', {mode: 'cors'})
        .then((response) => response.json());
}
