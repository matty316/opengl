#version 460 core

struct Material {
	sampler2D diffuse;
	sampler2D specular;
	float shininess;
};

uniform Material material;

struct DirLight {
	vec3 direction;

	vec3 ambient;
	vec3 diffuse;
	vec3 specular;
};
uniform DirLight dirLight;
vec3 calcDirLight(DirLight light, vec3 normal, vec3 viewDir);

struct PointLight {
	vec3 position;

	float constant;
	float linear;
	float quadratic;

	vec3 ambient;
	vec3 diffuse;
	vec3 specular;
};
#define NR_POINT_LIGHTS 4
uniform PointLight pointLights[NR_POINT_LIGHTS];
vec3 calcPointLight(PointLight light, vec3 normal, vec3 fragPos, vec3 viewDir);

struct SpotLight {
	vec3 position;
	vec3 direction;
	float cutoff;
	float outerCutoff;

	vec3 ambient;
	vec3 diffuse;
	vec3 specular;

	float constant;
	float linear;
	float quadratic;
};
uniform SpotLight spotLight;
vec3 calcSpotLight(SpotLight light, vec3 normal, vec3 fragPos, vec3 viewDir);

uniform vec3 viewPos;

in vec3 Normal;
in vec3 FragPos;
in vec2 TexCoords;

out vec4 FragColor;

void main() {
	vec3 norm = normalize(Normal);
	vec3 viewDir = normalize(viewPos - FragPos);

	vec3 result = calcDirLight(dirLight, norm, viewDir);

	for (int i = 0; i < NR_POINT_LIGHTS; i++)
		result += calcPointLight(pointLights[i], norm, FragPos, viewDir);

	result += calcSpotLight(spotLight, norm, FragPos, viewDir);

	FragColor = vec4(result, 1.0);
}

vec3 calcDirLight(DirLight light, vec3 normal, vec3 viewDir) {
	vec3 lightDir = normalize(-light.direction);
	float diff = max(dot(normal, lightDir), 0.0);
	vec3 reflectDir = reflect(-lightDir, normal);
	float spec = pow(max(dot(viewDir, reflectDir), 0.0), material.shininess);

	vec3 ambient = light.ambient * texture(material.diffuse, TexCoords).rgb;
	vec3 diffuse = light.diffuse * diff * texture(material.diffuse, TexCoords).rgb;
	vec3 specular = light.specular * spec * texture(material.specular, TexCoords).rgb;

	return ambient + diffuse + specular; 
}

vec3 calcPointLight(PointLight light, vec3 normal, vec3 fragPos, vec3 viewDir) {
	vec3 lightDir = normalize(light.position - fragPos);
	float diff = max(dot(normal, lightDir), 0.0);
	vec3 reflectDir = reflect(-lightDir, normal);
	float spec = pow(max(dot(viewDir, reflectDir), 0.0), material.shininess);

	float distance = length(light.position - fragPos);
	float attenuation = 1.0 / (light.constant + light.linear * distance + light.quadratic * distance * distance);

	vec3 ambient = light.ambient * texture(material. diffuse, TexCoords).rgb;

	vec3 diffuse = light.diffuse * diff * texture(material.diffuse, TexCoords).rgb;

	vec3 specular = light.specular * spec * texture(material.specular, TexCoords).rgb;

	ambient *= attenuation;
	diffuse *= attenuation;
	specular *= attenuation;

	return ambient + diffuse + specular;
}

vec3 calcSpotLight(SpotLight light, vec3 normal, vec3 fragPos, vec3 viewDir) {
	vec3 lightDir = normalize(light.position - fragPos);
	float theta = dot(lightDir, normalize(-light.direction));
	float episilon = light.cutoff - light.outerCutoff;
	float intensity = clamp((theta - light.outerCutoff) / episilon, 0.0, 1.0);
	float distance = length(light.position - fragPos);
	float attenuation = 1.0 / (light.constant + light.linear * distance + light.quadratic * distance * distance);

	float diff = max(dot(normal, lightDir), 0.0);
	vec3 diffuse = light.diffuse * diff * texture(material.diffuse, TexCoords).rgb;

	vec3 ambient = texture(material.diffuse, TexCoords).rgb * light.ambient;

	vec3 reflectDir = reflect(-lightDir, normal);
	float spec = pow(max(dot(viewDir, reflectDir), 0.0), material.shininess);
	vec3 specular = texture(material.specular, TexCoords).rgb * spec * light.specular;

	ambient *= attenuation;
	diffuse *= attenuation;
	specular *= attenuation;

	diffuse *= intensity;
	specular *= intensity;

	return ambient + diffuse + specular;
}