/**
 * Test the 'theme' data and utility functions.
 */
import {themes, displayVersion} from "../theme";

test('theme', () => {
    const projectNames = Object.keys(themes);

    // At least two projects
    expect(projectNames.length).toBeGreaterThanOrEqual(2);

    const firstProj = themes[projectNames[0]];

    // Project version formatter
    expect(firstProj.projectRelease).toBeDefined();
    const firstVer = displayVersion(firstProj);
    expect(firstVer).toMatch(/v\S+.*/); // loose match on version string
    const fakeProj1 = {projectRelease: {version: '1.2.3', depVersions: {}}};
    expect(displayVersion(fakeProj1)).toBe('v1.2.3');
    const fakeProj2 = {projectRelease: {version: '1.2.3', depVersions: {foo: '4.5.6'}}};
    expect(displayVersion(fakeProj2)).toBe('v1.2.3 (foo 4.5.6)');
})