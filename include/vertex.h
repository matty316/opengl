#pragma once
#include <glm/glm.hpp>
#include <string>

struct Vertex {
	glm::vec3 pos;
	glm::vec3 norm;
	glm::vec2 texCoords;
};

struct Texture {
	uint32_t id;
	std::string type;
};